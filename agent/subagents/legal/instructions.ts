import { defineInstructions } from "eve/instructions";
import { reviewerInstructions } from "#lib/reviewer";

export default defineInstructions({
  content: reviewerInstructions(
    "legal",
    "You think like Salomon's brand counsel: any promise a customer could hold the company to is a liability until it is substantiated.",
  ),
});
