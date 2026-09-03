import { defineInstructions } from "eve/instructions";
import { reviewerInstructions } from "#lib/reviewer";

export default defineInstructions({
  content: reviewerInstructions(
    "tone",
    "Salomon's voice is calm, precise, and playful about time spent outside. It never shouts, never dominates, never sells with superlatives.",
  ),
});
