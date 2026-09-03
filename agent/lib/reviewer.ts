import { defineAgent, defineDynamic, defineRemoteAgent } from "eve";
import { vercelOidc } from "eve/agents/auth";
import { type ReviewAxis, findingSetJsonSchema } from "./contract";
import { RULEBOOK_VERSION, rulebookMarkdown } from "./rulebook";

/**
 * Builds a review subagent for one axis.
 *
 * Local or remote is decided at session start:
 *  - when `<AXIS>_AGENT_URL` is set, the axis is served by a separately
 *    deployed eve agent (e.g. the Bedrock AgentCore-hosted sustainability
 *    agent from the reference) and called through `defineRemoteAgent`;
 *  - otherwise eve runs the declared local subagent under
 *    `agent/subagents/<axis>/` with its own instructions and model.
 *
 * Either way the parent workflow sees the same subagent tool name and the same
 * FindingSet output schema, so the outer loop never has to care.
 */
export function defineReviewer(axis: ReviewAxis, options: { readonly model: string; readonly description: string }) {
  const envKey = `${axis.toUpperCase()}_AGENT_URL`;

  return defineDynamic({
    events: {
      "session.started": () => {
        const remoteUrl = process.env[envKey];
        if (remoteUrl && remoteUrl.trim().length > 0) {
          return defineRemoteAgent({
            url: remoteUrl,
            description: `${options.description} (remote deployment)`,
            auth: vercelOidc(),
            outputSchema: findingSetJsonSchema,
          });
        }
        return defineAgent({
          description: options.description,
          model: options.model,
        });
      },
    },
  });
}

/** Shared system prompt for a local reviewer. */
export function reviewerInstructions(axis: ReviewAxis, role: string): string {
  return `You are the ${axis} review agent for Salomon product copy. ${role}

Rulebook version ${RULEBOOK_VERSION}. You only review the "${axis}" axis; ignore issues that belong to other axes.

Rules you enforce:
${rulebookMarkdown(axis)}

How to work:
- The parent sends the full copy (title, description, bullets). You never see the rest of the conversation.
- Read every field. Quote the exact offending text in \`quote\`, name the field in \`field\`.
- Use the rule IDs above. If something is clearly a ${axis} problem but no rule fits, use ${axis.slice(0, 3).toUpperCase()}-99 and severity "minor".
- One finding per distinct problem. Do not repeat a finding for the same quote.
- Return zero findings when the copy is clean; do not invent problems.
- Respond only with the requested structured output; no prose outside it.`;
}
