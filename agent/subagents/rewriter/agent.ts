import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Rewrites Salomon product copy to resolve a list of review findings while preserving meaning, facts and brand voice. Returns the revised copy fields.",
  model: "anthropic/claude-sonnet-4.6",
});
