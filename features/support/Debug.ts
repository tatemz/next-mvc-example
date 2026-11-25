import { Effect } from "effect";

export const debugMode = process.env.E2E_DEBUG === "1";

export const interactionPause = debugMode
  ? Effect.sleep("500 millis")
  : Effect.void;
