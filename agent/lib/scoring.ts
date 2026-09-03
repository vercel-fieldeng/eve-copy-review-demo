import {
  REVIEW_AXES,
  type Finding,
  type FindingSet,
  type ReviewAxis,
  type Severity,
  findingSetSchema,
} from "./contract";
import { RULEBOOK_VERSION, findRule } from "./rulebook";

/**
 * Deterministic, non-LLM scoring. Weighted rules only.
 * Every reviewer's findings are re-graded against the rulebook so the score is
 * reproducible and auditable regardless of which model produced the finding.
 */

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 40,
  major: 15,
  minor: 5,
  info: 1,
};

/** Relative weight of each axis in the aggregate. */
export const AXIS_WEIGHT: Record<ReviewAxis, number> = {
  legal: 1.0,
  sustainability: 1.0,
  tone: 0.8,
  glossary: 0.6,
  grammar: 0.5,
};

export const PASS_THRESHOLD = 80;

export interface AxisScore {
  readonly axis: ReviewAxis;
  readonly score: number;
  readonly findings: readonly Finding[];
  readonly summary: string;
  readonly critical: number;
  readonly major: number;
  readonly minor: number;
  readonly info: number;
  readonly failed?: string;
}

export interface ScoreReport {
  readonly rulebookVersion: RULEBOOK_VERSION_TYPE;
  readonly overall: number;
  readonly verdict: "approved" | "rewrite" | "escalate";
  readonly hasCritical: boolean;
  readonly axes: readonly AxisScore[];
  readonly blocking: readonly Finding[];
}
type RULEBOOK_VERSION_TYPE = typeof RULEBOOK_VERSION;

export type ReviewerOutcome =
  | { readonly axis: ReviewAxis; readonly ok: true; readonly value: unknown }
  | { readonly axis: ReviewAxis; readonly ok: false; readonly error: string };

function normalizeFinding(axis: ReviewAxis, finding: Finding): Finding {
  // The rulebook severity always wins over what the model reported, so a
  // reviewer cannot inflate or deflate a rule's weight.
  const rule = findRule(finding.ruleId);
  if (rule && rule.axis === axis) {
    return { ...finding, severity: rule.severity };
  }
  // Unknown or cross-axis IDs are capped at "major": still counted, never critical.
  return {
    ...finding,
    ruleId: rule ? finding.ruleId : `${axis.slice(0, 3).toUpperCase()}-99`,
    severity: finding.severity === "critical" ? "major" : finding.severity,
  };
}

function dedupe(findings: readonly Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter((f) => {
    const key = `${f.ruleId}|${f.field}|${f.quote.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function scoreAxis(outcome: ReviewerOutcome): AxisScore {
  const empty = { critical: 0, major: 0, minor: 0, info: 0 };
  if (!outcome.ok) {
    // A reviewer failure never silently passes: it is surfaced and treated
    // as a major finding so the loop cannot approve unreviewed copy.
    return {
      axis: outcome.axis,
      score: 0,
      findings: [],
      summary: `Reviewer unavailable: ${outcome.error}`,
      ...empty,
      major: 1,
      failed: outcome.error,
    };
  }

  const parsed = findingSetSchema.safeParse(outcome.value);
  if (!parsed.success) {
    return {
      axis: outcome.axis,
      score: 0,
      findings: [],
      summary: "Reviewer returned an invalid FindingSet.",
      ...empty,
      major: 1,
      failed: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const set: FindingSet = parsed.data;
  const findings = dedupe(set.findings.map((f) => normalizeFinding(outcome.axis, f)));
  const counts = { ...empty };
  let penalty = 0;
  for (const f of findings) {
    counts[f.severity] += 1;
    penalty += SEVERITY_WEIGHT[f.severity];
  }

  return {
    axis: outcome.axis,
    score: Math.max(0, 100 - penalty),
    findings,
    summary: set.summary,
    ...counts,
  };
}

export function buildScoreReport(
  outcomes: readonly ReviewerOutcome[],
  options: { readonly iteration: number; readonly maxIterations: number },
): ScoreReport {
  const axes = REVIEW_AXES.map((axis) => {
    const outcome = outcomes.find((o) => o.axis === axis);
    return scoreAxis(outcome ?? { axis, ok: false, error: "No result returned." });
  });

  const totalWeight = axes.reduce((sum, a) => sum + AXIS_WEIGHT[a.axis], 0);
  const overall = Math.round(
    axes.reduce((sum, a) => sum + a.score * AXIS_WEIGHT[a.axis], 0) / totalWeight,
  );

  const blocking = axes.flatMap((a) =>
    a.findings.filter((f) => f.severity === "critical" || f.severity === "major"),
  );
  const hasCritical = axes.some((a) => a.critical > 0);
  const passes = !hasCritical && overall >= PASS_THRESHOLD;

  let verdict: ScoreReport["verdict"];
  if (passes) verdict = "approved";
  else if (options.iteration >= options.maxIterations) verdict = "escalate";
  else verdict = "rewrite";

  return { rulebookVersion: RULEBOOK_VERSION, overall, verdict, hasCritical, axes, blocking };
}
