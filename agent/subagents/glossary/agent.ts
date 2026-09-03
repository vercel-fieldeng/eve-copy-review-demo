import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("glossary", {
  model: "anthropic/claude-haiku-4.5",
  description:
    "Reviews product copy against the Salomon glossary: proprietary technology names, preferred terminology, units and category naming. Returns a FindingSet.",
});
