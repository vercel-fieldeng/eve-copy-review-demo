import type { CopyFields } from "./contract";

/**
 * Golden-set style fixtures for the workshop. Each one is seeded with
 * violations across several axes so the review loop has something to find.
 */
export const SAMPLE_COPY: Record<string, CopyFields> = {
  "speedcross-6": {
    title: "Speedcross 6 GTX - The Ultimate Eco-Friendly Trail-Running Shoe!",
    description:
      "Meet the best trail shoe ever made. The Speedcross 6 is 100% waterproof thanks to Gore-tex and its Contra-grip sole guarantees you will never slip, wich means no more twisted ankles. Made from recycled materials, it's good for the planet and inspired by nature. Lighter than any competitor, its lifetime-lasting mid-sole with Sensifit technology will make you dominate every trail.",
    bullets: [
      "Aggressive lugs for total grip on any surface",
      "climate neutral production",
      "Weight: 300 grams",
      "Quick-lace system for fast on and off",
    ],
  },
  "x-ultra-5": {
    title: "X Ultra 5 Mid GORE-TEX",
    description:
      "A hiking boot built for long days with a heavy pack. The Advanced Chassis stabilises your ankle on technical descents, while the Contagrip outsole holds on wet rock and loose gravel. The upper uses 40% recycled polyester and the laces are 100% recycled. Waterproof GORE-TEX membrane rated to 28,000 mm.",
    bullets: ["ADV-C Chassis for stability", "Contagrip MA outsole", "Weight: 500 g (size UK 8.5)"],
  },
};

export const DEFAULT_SAMPLE = "speedcross-6";
