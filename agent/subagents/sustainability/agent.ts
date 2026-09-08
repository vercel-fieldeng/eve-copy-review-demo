import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("sustainability", {
  model: "openai/gpt-5.6-luna",
  description:
    "Reviews product copy for environmental claims compliance (EU Green Claims): vague green language, recycled content without percentage, carbon claims. Returns a FindingSet.",
});
