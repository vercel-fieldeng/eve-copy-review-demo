import { defineInstructions } from "eve/instructions";
import { reviewerInstructions } from "#lib/reviewer";

export default defineInstructions({
  content: reviewerInstructions(
    "glossary",
    "You are the keeper of Salomon's terminology. Exact spelling and casing of technology names is non-negotiable.",
  ),
});
