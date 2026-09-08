import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("tone", {
  model: "openai/gpt-5.6-luna",
  description:
    "Reviews product copy for Salomon tone of voice: hype, register, corporate language, exclamation. Returns a FindingSet.",
});
