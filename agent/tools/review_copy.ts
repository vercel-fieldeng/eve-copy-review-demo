import { defineTool } from "eve/tools";
import { agent, ask } from "eve/workflow";
import { z } from "zod";
import {
  REVIEW_AXES,
  type CopyFields,
  type ReviewAxis,
  copyFieldsSchema,
  findingSetJsonSchema,
  formatCopy,
  rewriteJsonSchema,
  rewriteSchema,
} from "../lib/contract";
import { DEFAULT_SAMPLE, SAMPLE_COPY } from "../lib/samples";
import { type ReviewerOutcome, type ScoreReport, buildScoreReport } from "../lib/scoring";

const MAX_ITERATIONS = 3;

/**
 * Outer loop of the Salomon copywriting agent, run as a durable Vercel
 * Workflow:
 *
 *   copy -> [tone | legal | sustainability | grammar | glossary] (parallel)
 *        -> deterministic scoring (non-LLM, weighted rulebook)
 *        -> approved?  yes -> score report
 *                      no  -> rewriter (max 3 iterations) -> loop
 *                      still failing -> human escalation (ask)
 *
 * Every reviewer call is an eve subagent (local or remote), invoked from
 * inside the workflow with a replay-stable key so a crash or redeploy mid-loop
 * resumes exactly where it stopped.
 */
export default defineTool({
  description:
    "Run the full Salomon copy review loop on product copy. Dispatches the five review agents in parallel, scores their findings deterministically, rewrites up to three times, and escalates to a human if the copy still fails. Pass `sample` to use one of the built-in demo copies instead of `copy`.",
  inputSchema: z.object({
    copy: copyFieldsSchema.optional().describe("The product copy fields to review."),
    sample: z
      .enum(Object.keys(SAMPLE_COPY) as [string, ...string[]])
      .optional()
      .describe(`Use a built-in demo copy: ${Object.keys(SAMPLE_COPY).join(", ")}.`),
    maxIterations: z.number().int().min(1).max(MAX_ITERATIONS).default(MAX_ITERATIONS),
  }),
  async *execute({ copy, sample, maxIterations }, ctx) {
    "use workflow";

    const original: CopyFields =
      copy ?? SAMPLE_COPY[sample ?? DEFAULT_SAMPLE] ?? SAMPLE_COPY[DEFAULT_SAMPLE];
    let current: CopyFields = original;
    const history: Array<{ iteration: number; report: ScoreReport; changeNotes: string[] }> = [];

    for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
      yield { phase: "reviewing", iteration, maxIterations, axes: REVIEW_AXES };

      // 1. Parallel dispatch: five subagents, five distinct replay keys.
      const outcomes = await Promise.all(
        REVIEW_AXES.map((axis) => reviewAxis(ctx, axis, current, iteration)),
      );

      // 2. Deterministic scoring (pure function, no model involved).
      yield { phase: "scoring", iteration, maxIterations };
      const report = buildScoreReport(outcomes, { iteration, maxIterations });

      if (report.verdict === "approved") {
        history.push({ iteration, report, changeNotes: [] });
        return {
          status: "approved" as const,
          iterations: iteration,
          original,
          final: current,
          report,
          history: history.map(summarizeIteration),
        };
      }

      if (report.verdict === "escalate") {
        history.push({ iteration, report, changeNotes: [] });
        yield { phase: "escalating", iteration, maxIterations, overall: report.overall };

        // 3b. Human escalation: the run parks here (no compute) until answered.
        const decision = await ask(ctx, {
          prompt: `After ${iteration} review iterations the copy still scores ${report.overall}/100 with ${report.blocking.length} blocking finding(s). How should we proceed?`,
          display: "confirmation",
          options: [
            { id: "accept", label: "Accept latest draft", description: "Publish the current rewrite as-is.", style: "primary" },
            { id: "manual", label: "Send to manual review", description: "Hand off to a human copywriter." },
            { id: "abandon", label: "Abandon", description: "Stop; keep the original copy.", style: "danger" },
          ],
        });

        return {
          status: "escalated" as const,
          decision: decision.optionId ?? "manual",
          iterations: iteration,
          original,
          final: decision.optionId === "abandon" ? original : current,
          report,
          history: history.map(summarizeIteration),
        };
      }

      // 3a. Bounded rewrite.
      yield { phase: "rewriting", iteration, maxIterations, overall: report.overall };
      const rewritten = await rewriteCopy(ctx, current, report, iteration);
      history.push({ iteration, report, changeNotes: rewritten.changeNotes });
      current = { title: rewritten.title, description: rewritten.description, bullets: rewritten.bullets };
    }

    // Unreachable: the loop always returns on approved/escalate at the last iteration.
    throw new Error("Review loop exited without a verdict.");
  },
});

async function reviewAxis(
  ctx: Parameters<typeof agent>[0],
  axis: ReviewAxis,
  copy: CopyFields,
  iteration: number,
): Promise<ReviewerOutcome> {
  try {
    const value = await agent(ctx, {
      key: `${axis}:${iteration}`,
      target: axis,
      outputSchema: findingSetJsonSchema,
      message: `Review the following Salomon product copy on the "${axis}" axis only and return a FindingSet with axis "${axis}".\n\n${formatCopy(copy)}`,
    });
    return { axis, ok: true, value };
  } catch (error) {
    return { axis, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function rewriteCopy(
  ctx: Parameters<typeof agent>[0],
  copy: CopyFields,
  report: ScoreReport,
  iteration: number,
) {
  const findings = report.axes.flatMap((a) =>
    a.findings.map(
      (f) => `- [${a.axis}] ${f.ruleId} (${f.severity}) in ${f.field}: "${f.quote}" — ${f.issue} Suggestion: ${f.suggestion}`,
    ),
  );

  const value = await agent(ctx, {
    key: `rewrite:${iteration}`,
    target: "rewriter",
    outputSchema: rewriteJsonSchema,
    message: `Rewrite this copy to resolve every finding below. Current overall score: ${report.overall}/100.\n\n${formatCopy(copy)}\n\nFindings:\n${findings.join("\n")}`,
  });

  const parsed = rewriteSchema.safeParse(value);
  if (!parsed.success) {
    // Fall back to the unchanged copy so the loop can still score and escalate.
    return { ...copy, changeNotes: ["Rewriter returned an invalid result; copy left unchanged."] };
  }
  return parsed.data;
}

function summarizeIteration(entry: { iteration: number; report: ScoreReport; changeNotes: string[] }) {
  return {
    iteration: entry.iteration,
    overall: entry.report.overall,
    verdict: entry.report.verdict,
    axes: entry.report.axes.map((a) => ({
      axis: a.axis,
      score: a.score,
      findings: a.findings.length,
      critical: a.critical,
      failed: a.failed,
    })),
    changeNotes: entry.changeNotes,
  };
}
