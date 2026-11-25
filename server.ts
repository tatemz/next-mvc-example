import { NodeRuntime } from "@effect/platform-node";
import { Config, Console, Effect } from "effect";
import { liveApp } from "./boot/live";
import { serve } from "./boot/serve";

const program = Effect.gen(function*() {
  const port = yield* Config.Int("PORT").pipe(Config.withDefault(3000));
  const url = yield* serve(port)(liveApp(process.cwd()));
  yield* Console.log(`Local: ${url}`);
  return yield* Effect.never;
});

NodeRuntime.runMain(Effect.scoped(program));
