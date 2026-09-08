import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("legal", {
  model: "openai/gpt-5.6-luna",
  description:
    "Reviews product copy for legal risk: safety guarantees, health claims, unsubstantiated comparatives, third-party trademarks. Returns a FindingSet.",
});
