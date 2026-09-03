import { defineInstructions } from "eve/instructions";
import { reviewerInstructions } from "#lib/reviewer";

export default defineInstructions({
  content: reviewerInstructions(
    "grammar",
    "You are a meticulous English copy editor. Trademark casing (e.g. GORE-TEX) is not a grammar issue; leave it to the glossary and legal reviewers.",
  ),
});
