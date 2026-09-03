import { z } from "zod";

/**
 * The shared Zod contract every review agent must honour.
 * Mirrors `src/schemas.ts` from the Salomon sustainability-agent reference:
 * a `Finding` and a `FindingSet`, keyed to rulebook IDs and severities.
 */

export const REVIEW_AXES = ["tone", "legal", "sustainability", "grammar", "glossary"] as const;
export type ReviewAxis = (typeof REVIEW_AXES)[number];

export const SEVERITIES = ["critical", "major", "minor", "info"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const findingSchema = z.object({
  ruleId: z.string().min(1).describe("Rulebook ID, e.g. SUS-02. Use AXIS-99 for an unlisted issue."),
  severity: z.enum(SEVERITIES),
  field: z.string().min(1).describe("Which copy field the finding is about (e.g. title, description)."),
  quote: z.string().min(1).describe("The exact offending text, quoted verbatim from the copy."),
  issue: z.string().min(1).describe("One sentence explaining what is wrong."),
  suggestion: z.string().min(1).describe("A concrete replacement or fix."),
});
export type Finding = z.infer<typeof findingSchema>;

export const findingSetSchema = z.object({
  axis: z.enum(REVIEW_AXES),
  findings: z.array(findingSchema).max(12),
  summary: z.string().min(1).describe("One or two sentences on the overall state of this axis."),
});
export type FindingSet = z.infer<typeof findingSetSchema>;

export const copyFieldsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  bullets: z.array(z.string().min(1)).max(8).default([]),
});
export type CopyFields = z.infer<typeof copyFieldsSchema>;

export const rewriteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  bullets: z.array(z.string().min(1)).max(8),
  changeNotes: z.array(z.string()).max(12).describe("What was changed and which finding it resolves."),
});
export type Rewrite = z.infer<typeof rewriteSchema>;

/** Plain-JSON schemas passed to subagents through `outputSchema`. */
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };
export const findingSetJsonSchema = z.toJSONSchema(findingSetSchema) as JsonObject;
export const rewriteJsonSchema = z.toJSONSchema(rewriteSchema) as JsonObject;

export function formatCopy(copy: CopyFields): string {
  const bullets = copy.bullets.length > 0 ? `\nBullets:\n${copy.bullets.map((b) => `- ${b}`).join("\n")}` : "";
  return `Title: ${copy.title}\n\nDescription:\n${copy.description}${bullets}`;
}
