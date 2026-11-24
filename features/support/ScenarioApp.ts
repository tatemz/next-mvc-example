import { NodeServices } from "@effect/platform-node";
import {
  Context,
  Deferred,
  Effect,
  Layer,
  Option,
  Schedule,
  Stream,
} from "effect";
import { ChildProcess } from "effect/process";
import { resolve } from "node:path";

export class ScenarioApp extends Context.Service<
  ScenarioApp,
  { readonly url: string }
>()("next-mvc-example/test/ScenarioApp") {}

const repoRoot = resolve(import.meta.dirname, "../..");
const nextBin = resolve(repoRoot, "node_modules/next/dist/bin/next");

const ansi = /\u001b\[[0-9;]*m/g;
const localLine = /^\s*(?:-\s*)?Local:\s+https?:\/\/\S+:(\d+)\s*$/;

export const parseNextStartPort = (line: string): Option.Option<number> => {
  const match = localLine.exec(line.replace(ansi, ""));
  return match === null ? Option.none() : Option.some(Number(match[1]));
};

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

const startNext = (env: Record<string, string>) =>
  Effect.gen(function*() {
    const child = yield* ChildProcess.make(
      process.execPath,
      [nextBin, "start", "-p", "0"],
      {
        cwd: repoRoot,
        env: { ...env, NODE_OPTIONS: undefined },
        extendEnv: true,
        stdout: "pipe",
        stderr: "inherit",
      },
    );
    yield* Effect.addFinalizer(() =>
      child
        .kill({ killSignal: "SIGTERM", forceKillAfter: "5 seconds" })
        .pipe(Effect.ignore),
    );
    const found = yield* Deferred.make<number>();
    yield* child.stdout.pipe(
      Stream.decodeText(),
      Stream.splitLines,
      Stream.runForEach((line) =>
        Effect.gen(function*() {
          yield* Effect.sync(() => process.stdout.write(`${line}\n`));
          const port = parseNextStartPort(line);
          if (Option.isSome(port)) {
            yield* Deferred.succeed(found, port.value);
          }
        }),
      ),
      Effect.forkScoped,
    );
    const port = yield* Deferred.await(found).pipe(
      Effect.timeout("30 seconds"),
      Effect.mapError(
        () =>
          new Error("next start did not report its port within 30 seconds"),
      ),
    );
    const url = `http://127.0.0.1:${port}`;
    yield* waitUntilReady(url);
    return url;
  });

export const scenarioApp = (env: Record<string, string>) =>
  Layer.effect(
    ScenarioApp,
    Effect.gen(function*() {
      const url = yield* startNext(env);
      return ScenarioApp.of({ url });
    }),
  ).pipe(Layer.provide(NodeServices.layer));
