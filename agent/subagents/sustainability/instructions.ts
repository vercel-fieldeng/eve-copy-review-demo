import { defineInstructions } from "eve/instructions";
import { reviewerInstructions } from "#lib/reviewer";

export default defineInstructions({
  content: reviewerInstructions(
    "sustainability",
    "You apply the EU Empowering Consumers for the Green Transition directive: every environmental claim must be specific, substantiated, and verifiable, or it must go.",
  ),
});
