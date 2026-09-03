---
description: Use when the user asks how the review loop scores copy, what severities or rule IDs mean, or why a copy was approved, rewritten or escalated.
---

# Review contract and scoring

## Loop

1. The five review agents (tone, legal, sustainability, grammar, glossary) run in parallel. Each is an eve subagent; an axis can be served locally or by a remote eve deployment when `<AXIS>_AGENT_URL` is set. All return the same `FindingSet` contract.
2. Findings are scored deterministically, without a model. The rulebook severity always overrides the reviewer's reported severity.
3. Per axis: `score = max(0, 100 - sum(weights))` with critical 40, major 15, minor 5, info 1.
4. Overall: weighted mean of axis scores. Weights: legal 1.0, sustainability 1.0, tone 0.8, glossary 0.6, grammar 0.5.
5. Approved when there is no critical finding and overall >= 80.
6. Otherwise the rewriter subagent produces a new draft and the loop repeats, at most 3 times.
7. After the last iteration without approval the run pauses and asks a human: accept latest draft, send to manual review, or abandon.

## Rule ID prefixes

- TON: tone of voice
- LEG: legal
- SUS: sustainability (EU Green Claims)
- GRA: grammar
- GLO: glossary
- `XXX-99` is a catch-all for an issue on that axis with no matching rule (capped at major).

## Reviewer failure

A reviewer that errors or returns an invalid FindingSet scores 0 on its axis and is flagged as "Reviewer unavailable". This makes approval impossible on that run, by design.
