import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("grammar", {
  model: "openai/gpt-5.6-luna",
  description:
    "Reviews product copy for spelling, punctuation, agreement, capitalization consistency and readability. Returns a FindingSet.",
});
