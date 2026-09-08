import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("glossary", {
  model: "openai/gpt-5.6-luna",
  description:
    "Reviews product copy against the Salomon glossary: proprietary technology names, preferred terminology, units and category naming. Returns a FindingSet.",
});
