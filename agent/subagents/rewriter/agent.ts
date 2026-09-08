import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Rewrites Salomon product copy to resolve a list of review findings while preserving meaning, facts and brand voice. Returns the revised copy fields.",
  model: "openai/gpt-5.6-luna",
  modelOptions: {
    providerOptions: {
      openai: { reasoningEffort: "medium", serviceTier: "priority" },
    },
  },
});
