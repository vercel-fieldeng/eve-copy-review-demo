import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("grammar", {
  model: "anthropic/claude-haiku-4.5",
  description:
    "Reviews product copy for spelling, punctuation, agreement, capitalization consistency and readability. Returns a FindingSet.",
});
