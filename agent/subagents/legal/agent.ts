import { defineReviewer } from "#lib/reviewer";

export default defineReviewer("legal", {
  model: "anthropic/claude-sonnet-4.6",
  description:
    "Reviews product copy for legal risk: safety guarantees, health claims, unsubstantiated comparatives, third-party trademarks. Returns a FindingSet.",
});
