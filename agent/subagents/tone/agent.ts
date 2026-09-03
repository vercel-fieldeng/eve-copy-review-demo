import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("tone", {
  model: "anthropic/claude-sonnet-4.6",
  description:
    "Reviews product copy for Salomon tone of voice: hype, register, corporate language, exclamation. Returns a FindingSet.",
});
