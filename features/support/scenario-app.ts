import { NodeServices } from "@effect/platform-node";
import { Context, Effect, Layer, Schedule } from "effect";
import { ChildProcess } from "effect/process";
import { createServer } from "node:net";
import { resolve } from "node:path";

export class ScenarioApp extends Context.Service<
  ScenarioApp,
  { readonly url: string }
>()("next-mvc-example/test/ScenarioApp") {}

const freePort = Effect.tryPromise({
  try: () =>
    new Promise<number>((resolve, reject) => {
      const server = createServer();
      server.on("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        const port =
          typeof address === "object" && address !== null ? address.port : 0;
        server.close((error) => (error ? reject(error) : resolve(port)));
      });
    }),
  catch: (cause) => new Error(`Could not find a free port: ${String(cause)}`),
});

const waitUntilReady = (url: string) =>
  Effect.gen(function*() {
    const response = yield* Effect.tryPromise({
      try: () => fetch(url),
      catch: (cause) =>
        new Error(`The app did not answer at ${url}: ${String(cause)}`),
    });
    if (!response.ok) {
      return yield* Effect.fail(
        new Error(`The app answered ${response.status} at ${url}`),
      );
    }
  }).pipe(
    Effect.retry({ schedule: Schedule.spaced("250 millis"), times: 120 }),
    Effect.timeout("30 seconds"),
  );

export const scenarioApp = (env: Record<string, string>) =>
  Layer.effect(
    ScenarioApp,
    Effect.gen(function*() {
      const port = yield* freePort;
      const repoRoot = resolve(import.meta.dirname, "../..");
      const child = yield* ChildProcess.make(
        process.execPath,
        [resolve(repoRoot, "node_modules/next/dist/bin/next"), "start", "-p", String(port)],
        {
          cwd: repoRoot,
          env: { ...env, NODE_OPTIONS: undefined },
          extendEnv: true,
          stdout: "inherit",
          stderr: "inherit",
        },
      );
      yield* Effect.addFinalizer(() =>
        child
          .kill({ killSignal: "SIGTERM", forceKillAfter: "5 seconds" })
          .pipe(Effect.ignore),
      );
      const url = `http://127.0.0.1:${port}`;
      yield* waitUntilReady(url);
      return ScenarioApp.of({ url });
    }),
  ).pipe(Layer.provide(NodeServices.layer));
