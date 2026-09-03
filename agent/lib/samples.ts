import type { CopyFields, ReviewAxis } from "./contract";

/**
 * Golden-set style fixtures for the workshop. Each sample is seeded to trip
 * specific review axes so a presenter can pick the failure mode they want to
 * show. `seeded` lists the axes expected to raise findings; an empty list
 * means the copy should pass (or come very close) on the first iteration.
 *
 * This module is imported by both the eve tool (server) and the chat UI
 * (client), so keep it free of runtime dependencies.
 */

export type SampleCategory = "Trail Running" | "Hiking" | "Alpine" | "Ski" | "Sportstyle";

export interface SampleCopy {
  readonly id: string;
  readonly label: string;
  readonly category: SampleCategory;
  readonly note: string;
  readonly seeded: readonly ReviewAxis[];
  readonly copy: CopyFields;
}

export const SAMPLES: readonly SampleCopy[] = [
  {
    id: "speedcross-6-gtx",
    label: "Speedcross 6 GTX",
    category: "Trail Running",
    note: "Everything wrong at once. Expect escalation.",
    seeded: ["tone", "legal", "sustainability", "grammar", "glossary"],
    copy: {
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
  },
  {
    id: "x-ultra-5-mid-gtx",
    label: "X Ultra 5 Mid GORE-TEX",
    category: "Hiking",
    note: "Clean baseline. Should approve in one or two passes.",
    seeded: [],
    copy: {
      title: "X Ultra 5 Mid GORE-TEX",
      description:
        "A hiking boot built for long days with a heavy pack. The ADV-C Chassis stabilises your ankle on technical descents, while the Contagrip outsole holds on wet rock and loose gravel. The upper uses 40% recycled polyester and the laces are 100% recycled. Waterproof GORE-TEX membrane rated to 28,000 mm.",
      bullets: ["ADV-C Chassis for stability", "Contagrip MA outsole", "Weight: 500 g (size UK 8.5)"],
    },
  },
  {
    id: "s-lab-ultra-3",
    label: "S/LAB Ultra 3",
    category: "Trail Running",
    note: "Hype register and comparatives with no benchmark.",
    seeded: ["tone", "legal"],
    copy: {
      title: "S/LAB Ultra 3 - The Most Revolutionary Ultra Shoe Ever Built",
      description:
        "Engineered with our elite athletes, the S/LAB Ultra 3 is a game-changer that will leave every competitor in the dust. Faster than any other ultra shoe on the market and 20% lighter than the competition, it lets you crush 100 miles without breaking a sweat. Energy Foam returns more energy than anything else out there, and the Contagrip outsole is the grippiest ever made. Dominate your next ultra.",
      bullets: [
        "Energy Foam midsole",
        "Contagrip MA outsole",
        "Weight: 290 g (size UK 8.5)",
        "8 mm drop",
      ],
    },
  },
  {
    id: "sense-ride-5",
    label: "Sense Ride 5",
    category: "Trail Running",
    note: "Sound claims, sloppy text: typos, agreement, spacing, casing.",
    seeded: ["grammar", "glossary"],
    copy: {
      title: "Sense ride 5 trail running shoe",
      description:
        "The Sense Ride 5 are a versatile trail running shoe for runner who want one shoe for everything.  Its Energy Foam midsole cushion your stride on long road sections, while the Contagrip outsole grip on dirt, rock and mud   The upper use a reinforced mesh that breath well and dry quickly, and the Quicklace system make it easy to get in and out",
      bullets: [
        "Energy Foam Midsole For All-Day Comfort",
        "contagrip outsole",
        "Weight: 285 g (size UK 8.5)",
        "Quicklace system,",
      ],
    },
  },
  {
    id: "quest-4-gtx",
    label: "Quest 4 GORE-TEX",
    category: "Hiking",
    note: "Safety, medical and warranty claims. Legal will block.",
    seeded: ["legal"],
    copy: {
      title: "Quest 4 GORE-TEX Hiking Boot",
      description:
        "Built for multi-day treks with a heavy pack, the Quest 4 GORE-TEX prevents ankle injuries thanks to the ADV-C Chassis and eliminates blisters with its SensiFit upper. Recommended by physiotherapists to protect your knees and joints on long descents, it is fully waterproof and guarantees dry feet in any conditions. The Contagrip outsole makes slipping impossible, and the indestructible construction means this is the last boot you will ever need to buy.",
      bullets: [
        "ADV-C Chassis",
        "GORE-TEX membrane",
        "Contagrip TD outsole",
        "Weight: 655 g (size UK 8.5)",
      ],
    },
  },
  {
    id: "ultra-glide-2",
    label: "Ultra Glide 2",
    category: "Trail Running",
    note: "Greenwashing: vague claims, carbon neutral, roadmap as fact.",
    seeded: ["sustainability"],
    copy: {
      title: "Ultra Glide 2 - Carbon Neutral Trail Running",
      description:
        "The Ultra Glide 2 is our most sustainable shoe yet and proof that performance can be planet-positive. Made from recycled materials and produced in a carbon-neutral factory, every pair gives back to nature. Our entire trail running range is now fully circular, so when you are done, the mountains stay clean. Energy Foam cushioning and a Contagrip outsole keep long runs smooth, while the green colourway reflects the forests that inspired it.",
      bullets: [
        "Eco-friendly construction",
        "Carbon neutral",
        "Energy Foam midsole",
        "Weight: 275 g (size UK 8.5)",
      ],
    },
  },
  {
    id: "xa-pro-3d-v9",
    label: "XA Pro 3D V9",
    category: "Hiking",
    note: "Technology names and units drift from the glossary.",
    seeded: ["glossary"],
    copy: {
      title: "XA Pro 3D v9 Trail-Running & Hiking Shoe",
      description:
        "A do-anything shoe for trailrunning and fast hiking. The Contra Grip sole bites into loose terrain, the Sensi-fit top wraps your foot, and the quick lace system tucks away in the tongue. The 3D Advanced Chasis keeps your foot stable on rough ground, and the EVA mid-sole handles long days. Available in the Hike category.",
      bullets: [
        "Contra Grip outsole",
        "Sensi-fit upper",
        "Weight: 0.37kg",
        "11mm drop, stack 32/21",
      ],
    },
  },
  {
    id: "bonatti-trail-jacket",
    label: "Bonatti Trail Jacket",
    category: "Trail Running",
    note: "Near pass with one critical: unrated waterproof claim.",
    seeded: ["legal", "sustainability"],
    copy: {
      title: "Bonatti Trail Waterproof Jacket",
      description:
        "A packable shell for changeable mountain weather. The Bonatti Trail is 100% waterproof and fully breathable, with a 2.5-layer fabric made from recycled materials. It stuffs into its own chest pocket and weighs next to nothing, so it lives in your pack until the clouds roll in. An adjustable hood fits over a cap and the hem cinches one-handed.",
      bullets: [
        "2.5-layer waterproof fabric",
        "Packs into chest pocket",
        "Weight: 160 g (size M)",
        "Adjustable hood",
      ],
    },
  },
  {
    id: "xt-6",
    label: "XT-6",
    category: "Sportstyle",
    note: "Off-brand slang, shouting and exclamation marks.",
    seeded: ["tone", "grammar"],
    copy: {
      title: "XT-6 - Your New Drip Just Dropped!!!",
      description:
        "Straight from the archives and onto the streets, the XT-6 is the ULTIMATE flex. This thing is fire. Snag a pair before they sell out and watch your crew lose their minds. Originally a trail running shoe, now it's the shoe that wins every fit check, no cap. Gel cushioning, Quicklace, Contagrip - all the tech, all the clout. Don't sleep on it.",
      bullets: [
        "Iconic Y2K silhouette",
        "Quicklace",
        "LITERALLY the comfiest shoe ever",
        "Weight: 335 g (size UK 8.5)",
      ],
    },
  },
  {
    id: "qst-106",
    label: "QST 106",
    category: "Ski",
    note: "Clean. Sustainability goal phrased correctly with a date.",
    seeded: [],
    copy: {
      title: "QST 106 Freeride Ski",
      description:
        "A freeride ski for skiers who spend their days looking for soft snow and steep lines. A full poplar woodcore with cork inserts in the tip damps vibration, and the C/FX carbon and flax layup keeps the ski light without losing stability at speed. The 106 mm waist floats in fresh snow and still holds an edge on the firm traverse back to the lift. We aim to source 100% of our ski woodcores from FSC-certified forests by 2028; today, the QST 106 woodcore is 80% FSC-certified poplar.",
      bullets: [
        "Full poplar woodcore with cork inserts",
        "C/FX 2 carbon and flax reinforcement",
        "Waist: 106 mm",
        "Available lengths: 165, 173, 181, 189 cm",
      ],
    },
  },
];

/** Lookup by id, used by the `review_copy` tool's `sample` input. */
export const SAMPLE_COPY: Record<string, CopyFields> = Object.fromEntries(
  SAMPLES.map((sample) => [sample.id, sample.copy]),
);

export const DEFAULT_SAMPLE = SAMPLES[0].id;

/**
 * The chat message the UI sends when a sample is picked. It carries the
 * sample id (so the agent can pass `sample` to the tool) and the full copy
 * (so the audience can read what is being reviewed).
 */
export function formatSampleMessage(sample: SampleCopy): string {
  const bullets = sample.copy.bullets.map((bullet) => `- ${bullet}`).join("\n");
  return [
    `Review this copy (sample: ${sample.id}).`,
    "",
    `Title: ${sample.copy.title}`,
    "",
    `Description: ${sample.copy.description}`,
    "",
    "Bullets:",
    bullets,
  ].join("\n");
}
