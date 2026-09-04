"use client";

import { FileTextIcon } from "lucide-react";
import { formatSampleMessage, SAMPLES, type SampleCopy } from "@/agent/lib/samples";
import {
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";

const AXIS_SHORT: Record<SampleCopy["seeded"][number], string> = {
  tone: "tone",
  legal: "legal",
  sustainability: "sustain.",
  grammar: "grammar",
  glossary: "glossary",
};

/**
 * Loads a sample into the composer (rather than sending it) so the copy is
 * visible to the room before the review starts and can still be edited.
 */
function useLoadSample() {
  const controller = usePromptInputController();

  return (sample: SampleCopy) => {
    controller.textInput.setInput(formatSampleMessage(sample));
    // Defer until the controlled textarea has re-rendered with the new value.
    requestAnimationFrame(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      textarea?.focus();
      textarea?.setSelectionRange(0, 0);
      textarea?.scrollTo({ top: 0 });
    });
  };
}

function SeededTags({ seeded }: { readonly seeded: SampleCopy["seeded"] }) {
  if (seeded.length === 0) {
    return (
      <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary">
        clean
      </span>
    );
  }

  return (
    <>
      {seeded.map((axis) => (
        <span
          className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          key={axis}
        >
          {AXIS_SHORT[axis]}
        </span>
      ))}
    </>
  );
}

/** Empty-state grid: all samples visible at once. */
export function SampleGrid({ className }: { readonly className?: string }) {
  const loadSample = useLoadSample();

  return (
    <section aria-labelledby="sample-copy-heading" className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2
          className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
          id="sample-copy-heading"
        >
          Sample copy
        </h2>
        <p className="text-muted-foreground text-xs">Pick one to load it into the composer</p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {SAMPLES.map((sample) => (
          <li key={sample.id}>
            <button
              className="flex w-full flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-foreground/25 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => loadSample(sample)}
              type="button"
            >
              <div className="flex w-full items-baseline justify-between gap-2">
                <span className="truncate font-medium text-sm">{sample.label}</span>
                <span className="shrink-0 text-muted-foreground text-xs">{sample.category}</span>
              </div>
              <p className="line-clamp-1 text-muted-foreground text-xs">{sample.note}</p>
              <div className="flex flex-wrap gap-1">
                <SeededTags seeded={sample.seeded} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Composer dropdown: same samples, reachable once a conversation has started. */
export function SampleMenu({ disabled = false }: { readonly disabled?: boolean }) {
  const loadSample = useLoadSample();

  return (
    <PromptInputActionMenu>
      <PromptInputActionMenuTrigger
        aria-label="Load sample copy"
        disabled={disabled}
        tooltip="Load sample copy"
      >
        <FileTextIcon className="size-4" />
      </PromptInputActionMenuTrigger>
      <PromptInputActionMenuContent className="w-72" side="top">
        {SAMPLES.map((sample) => (
          <PromptInputActionMenuItem
            className="flex flex-col items-start gap-0.5"
            key={sample.id}
            onSelect={() => loadSample(sample)}
          >
            <span className="flex w-full items-baseline justify-between gap-2">
              <span className="truncate font-medium">{sample.label}</span>
              <span className="shrink-0 text-muted-foreground text-xs">{sample.category}</span>
            </span>
            <span className="flex flex-wrap gap-1">
              <SeededTags seeded={sample.seeded} />
            </span>
          </PromptInputActionMenuItem>
        ))}
      </PromptInputActionMenuContent>
    </PromptInputActionMenu>
  );
}
