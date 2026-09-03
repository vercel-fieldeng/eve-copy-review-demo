"use client";

import { CheckIcon, CircleAlertIcon, LoaderCircleIcon, UserRoundIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders the `review_copy` workflow tool: live phase while the Workflow run
 * is in flight (the tool's `yield` snapshots), then the final score report.
 * Shapes mirror `agent/tools/review_copy.ts`; unknown shapes fall through so
 * the generic tool output still shows.
 */

const AXES = ["tone", "legal", "sustainability", "grammar", "glossary"] as const;
type Axis = (typeof AXES)[number];

const AXIS_LABEL: Record<Axis, string> = {
  tone: "Tone of voice",
  legal: "Legal",
  sustainability: "Sustainability",
  grammar: "Grammar",
  glossary: "Glossary",
};

type Progress = {
  phase: "reviewing" | "scoring" | "rewriting" | "escalating";
  iteration: number;
  maxIterations: number;
  overall?: number;
};

type Finding = {
  ruleId: string;
  severity: "critical" | "major" | "minor" | "info";
  field: string;
  quote: string;
  issue: string;
  suggestion: string;
};

type AxisScore = {
  axis: Axis;
  score: number;
  findings: Finding[];
  summary: string;
  critical: number;
  major: number;
  minor: number;
  info: number;
  failed?: string;
};

type Report = {
  overall: number;
  verdict: "approved" | "rewrite" | "escalate";
  hasCritical: boolean;
  axes: AxisScore[];
  blocking: Finding[];
  rulebookVersion: string;
};

type Copy = { title: string; description: string; bullets: string[] };

type IterationSummary = {
  iteration: number;
  overall: number;
  verdict: Report["verdict"];
  changeNotes: string[];
  axes: { axis: Axis; score: number; findings: number; critical: number; failed?: string }[];
};

type Result = {
  status: "approved" | "escalated";
  decision?: string;
  iterations: number;
  original: Copy;
  final: Copy;
  report: Report;
  history: IterationSummary[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isReviewProgress(value: unknown): value is Progress {
  return isRecord(value) && typeof value.phase === "string" && typeof value.iteration === "number";
}

export function isReviewResult(value: unknown): value is Result {
  return (
    isRecord(value) &&
    (value.status === "approved" || value.status === "escalated") &&
    isRecord(value.report) &&
    Array.isArray((value.report as Record<string, unknown>).axes) &&
    isRecord(value.final)
  );
}

const PHASE_LABEL: Record<Progress["phase"], string> = {
  reviewing: "Five review agents running in parallel",
  scoring: "Scoring findings against the rulebook",
  rewriting: "Rewriter resolving blocking findings",
  escalating: "Waiting for a human decision",
};

export function ReviewProgress({ progress }: { readonly progress: Progress }) {
  const isHuman = progress.phase === "escalating";
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-2 text-sm">
        {isHuman ? (
          <UserRoundIcon className="size-4 text-muted-foreground" />
        ) : (
          <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground" />
        )}
        <span className="font-medium">{PHASE_LABEL[progress.phase]}</span>
        <span className="ml-auto font-mono text-muted-foreground text-xs">
          iteration {progress.iteration}/{progress.maxIterations}
          {typeof progress.overall === "number" ? ` · ${progress.overall}/100` : ""}
        </span>
      </div>
      {progress.phase === "reviewing" ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Review agents">
          {AXES.map((axis) => (
            <li
              className="flex items-center gap-2 rounded-md border border-dashed px-2.5 py-1.5 text-xs text-muted-foreground"
              key={axis}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-foreground/60" />
              {AXIS_LABEL[axis]}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ReviewReport({ result }: { readonly result: Result }) {
  const { report, final, history, status } = result;
  const approved = status === "approved";

  return (
    <div className="flex flex-col gap-5 rounded-lg border bg-card p-4 text-card-foreground">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs",
                approved
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
              )}
            >
              {approved ? <CheckIcon className="size-3" /> : <CircleAlertIcon className="size-3" />}
              {approved ? "Copy approved" : `Escalated · ${decisionLabel(result.decision)}`}
            </span>
            <span className="text-muted-foreground text-xs">
              {result.iterations} iteration{result.iterations === 1 ? "" : "s"} · rulebook {report.rulebookVersion}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            {report.blocking.length === 0
              ? "No blocking findings remain."
              : `${report.blocking.length} blocking finding${report.blocking.length === 1 ? "" : "s"} remain.`}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-4xl tabular-nums tracking-tight">{report.overall}</span>
          <span className="text-muted-foreground text-sm">/100</span>
        </div>
      </header>

      <ul className="flex flex-col gap-2" aria-label="Scores per review axis">
        {report.axes.map((axis) => (
          <li className="flex flex-col gap-1.5" key={axis.axis}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                {AXIS_LABEL[axis.axis] ?? axis.axis}
                {axis.failed ? (
                  <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-destructive text-xs">
                    reviewer unavailable
                  </span>
                ) : null}
              </span>
              <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-muted-foreground">
                {axis.critical > 0 ? <span className="text-destructive">{axis.critical} critical</span> : null}
                {axis.major > 0 ? <span>{axis.major} major</span> : null}
                {axis.minor > 0 ? <span>{axis.minor} minor</span> : null}
                <span className="w-8 text-right text-foreground">{axis.score}</span>
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-700",
                  axis.critical > 0 ? "bg-destructive" : axis.score >= 80 ? "bg-foreground" : "bg-amber-500",
                )}
                style={{ width: `${Math.max(2, axis.score)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {history.length > 1 ? (
        <ol className="flex flex-col gap-1.5 border-t pt-4" aria-label="Review loop history">
          {history.map((entry) => (
            <li className="flex flex-col gap-1 text-xs" key={entry.iteration}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground">#{entry.iteration}</span>
                <span className="font-mono tabular-nums">{entry.overall}/100</span>
                <span className="text-muted-foreground">
                  {entry.verdict === "approved"
                    ? "approved"
                    : entry.verdict === "rewrite"
                      ? `${entry.axes.reduce((n, a) => n + a.findings, 0)} findings → rewrite`
                      : "escalated to human"}
                </span>
              </div>
              {entry.changeNotes.length > 0 ? (
                <ul className="ml-6 flex flex-col gap-0.5 text-muted-foreground">
                  {entry.changeNotes.slice(0, 6).map((note, i) => (
                    <li key={`${entry.iteration}-${i}`}>{note}</li>
                  ))}
                  {entry.changeNotes.length > 6 ? (
                    <li>+{entry.changeNotes.length - 6} more changes</li>
                  ) : null}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}

      <section className="flex flex-col gap-2 border-t pt-4" aria-label="Final copy">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">Final copy</p>
        <h3 className="font-medium text-base leading-snug text-balance">{final.title}</h3>
        <p className="text-sm leading-relaxed text-pretty">{final.description}</p>
        {final.bullets.length > 0 ? (
          <ul className="list-disc pl-5 text-sm leading-relaxed">
            {final.bullets.map((bullet, i) => (
              <li key={`${i}-${bullet.slice(0, 12)}`}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}

function decisionLabel(decision: string | undefined): string {
  switch (decision) {
    case "accept":
      return "latest draft accepted";
    case "abandon":
      return "abandoned, original kept";
    default:
      return "sent to manual review";
  }
}
