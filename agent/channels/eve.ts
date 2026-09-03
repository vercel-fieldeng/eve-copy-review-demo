import { eveChannel } from "eve/channels/eve";
import { localDev, none, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  auth: [
    // Lets the eve TUI, Vercel deployments, and remote review subagents
    // (when this deployment is called as a remote agent) reach the agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    // Public workshop demo. Swap for Auth0 (JWT / OIDC) to match the
    // Salomon macro architecture before shipping to real users.
    none(),
  ],
});
