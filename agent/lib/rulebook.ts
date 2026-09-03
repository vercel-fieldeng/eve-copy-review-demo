import type { ReviewAxis, Severity } from "./contract";

/**
 * Versioned rulebook: unique IDs and severities per axis.
 * The equivalent of `rules/rulebook.yaml` in the reference service, kept in
 * TypeScript so both the review subagents (via their skills) and the
 * deterministic scorer read the exact same source of truth.
 */

export const RULEBOOK_VERSION = "2026.09-a";

export interface Rule {
  readonly id: string;
  readonly axis: ReviewAxis;
  readonly severity: Severity;
  readonly title: string;
  readonly detail: string;
}

export const RULES: readonly Rule[] = [
  // Tone of voice
  { id: "TON-01", axis: "tone", severity: "major", title: "Hype language", detail: "No superlatives or hype (best ever, revolutionary, game-changing, ultimate). Salomon speaks with quiet mountain confidence." },
  { id: "TON-02", axis: "tone", severity: "minor", title: "Passive or corporate voice", detail: "Prefer active, second-person, sensory language over corporate abstraction (solutions, leverage, synergy)." },
  { id: "TON-03", axis: "tone", severity: "minor", title: "Exclamation and shouting", detail: "No exclamation marks, no ALL CAPS words other than trademarks." },
  { id: "TON-04", axis: "tone", severity: "major", title: "Off-brand register", detail: "Avoid slang, memes, and aggressive competitiveness. Salomon is about play in the mountains, not domination." },
  // Legal
  { id: "LEG-01", axis: "legal", severity: "critical", title: "Absolute safety claim", detail: "Never promise safety outcomes: 'prevents injury', 'guaranteed grip', 'you will never fall', '100% waterproof' without a rating." },
  { id: "LEG-02", axis: "legal", severity: "critical", title: "Medical or health claim", detail: "No claims about curing, treating, or preventing medical conditions, or improving joints/health." },
  { id: "LEG-03", axis: "legal", severity: "major", title: "Unsubstantiated comparative", detail: "Comparatives (lighter than, faster than, #1, best-selling) require a named, verifiable benchmark." },
  { id: "LEG-04", axis: "legal", severity: "major", title: "Third-party trademark misuse", detail: "Third-party technologies (GORE-TEX, Vibram, BOA) must be written with correct capitalization and only if licensed for this product." },
  { id: "LEG-05", axis: "legal", severity: "minor", title: "Warranty implication", detail: "Avoid 'lifetime', 'indestructible', 'never wears out' which imply a warranty." },
  // Sustainability
  { id: "SUS-01", axis: "sustainability", severity: "critical", title: "Vague green claim", detail: "Unqualified 'eco-friendly', 'green', 'sustainable', 'good for the planet', 'climate neutral' are prohibited (EU Green Claims / Empowering Consumers directive)." },
  { id: "SUS-02", axis: "sustainability", severity: "major", title: "Recycled content without percentage", detail: "'Made from recycled materials' must state which component and the percentage (e.g. 'upper: 60% recycled polyester')." },
  { id: "SUS-03", axis: "sustainability", severity: "major", title: "Carbon claim without basis", detail: "Carbon or emissions claims need a stated scope, method, and third-party verification." },
  { id: "SUS-04", axis: "sustainability", severity: "minor", title: "Nature imagery as proof", detail: "Do not use natural imagery or 'inspired by nature' language to imply environmental benefit." },
  { id: "SUS-05", axis: "sustainability", severity: "minor", title: "Future promise as present fact", detail: "Roadmap commitments must be phrased as goals with a date, not as current achievements." },
  // Grammar
  { id: "GRA-01", axis: "grammar", severity: "major", title: "Spelling error", detail: "Misspelled words, including product or material names." },
  { id: "GRA-02", axis: "grammar", severity: "minor", title: "Punctuation and spacing", detail: "Double spaces, missing terminal punctuation, mismatched quotes, stray commas." },
  { id: "GRA-03", axis: "grammar", severity: "minor", title: "Agreement and tense", detail: "Subject-verb agreement, tense consistency across a field." },
  { id: "GRA-04", axis: "grammar", severity: "minor", title: "Inconsistent capitalization", detail: "Title Case vs sentence case must be consistent within a field; bullets share one style." },
  { id: "GRA-05", axis: "grammar", severity: "info", title: "Readability", detail: "Sentences over ~28 words or three-level nested clauses should be split." },
  // Glossary
  { id: "GLO-01", axis: "glossary", severity: "major", title: "Proprietary technology name", detail: "Salomon technologies use exact casing: Contagrip, SensiFit, Quicklace, Energy Foam, Optivibe, ADV-C Chassis, Active Chassis, MTN. No variants (e.g. 'Contra-grip', 'Sensifit')." },
  { id: "GLO-02", axis: "glossary", severity: "minor", title: "Preferred terminology", detail: "Use 'trail running' not 'trail-running' or 'trailrunning'; 'midsole' not 'mid-sole'; 'outsole' not 'sole'; 'upper' not 'top'." },
  { id: "GLO-03", axis: "glossary", severity: "minor", title: "Units and formatting", detail: "Weights as 'xxx g (size UK 8.5)', drop as 'x mm drop', stack as 'xx mm / yy mm'." },
  { id: "GLO-04", axis: "glossary", severity: "info", title: "Category naming", detail: "Categories are 'Trail Running', 'Hiking', 'Alpine', 'Ski', 'Sportstyle' with these exact spellings." },
];

export function rulesForAxis(axis: ReviewAxis): readonly Rule[] {
  return RULES.filter((rule) => rule.axis === axis);
}

export function findRule(ruleId: string): Rule | undefined {
  return RULES.find((rule) => rule.id === ruleId);
}

export function rulebookMarkdown(axis: ReviewAxis): string {
  return rulesForAxis(axis)
    .map((rule) => `- **${rule.id}** (${rule.severity}) ${rule.title}: ${rule.detail}`)
    .join("\n");
}
