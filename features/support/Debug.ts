import { Effect } from "effect";

export const debugMode = process.env.E2E_DEBUG === "1";

export const interactionPause = debugMode
  ? Effect.sleep("1 second")
  : Effect.void;
