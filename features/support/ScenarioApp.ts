import { NodeServices } from "@effect/platform-node";
import {
  Context,
  Deferred,
  Effect,
  Layer,
  Option,
  Schedule,
  Schema,
  Stream,
} from "effect";
import { ChildProcess } from "effect/process";
import { resolve } from "node:path";

export class ScenarioApp extends Context.Service<
  ScenarioApp,
  { readonly url: string }
>()("next-mvc-example/test/ScenarioApp") {}

class ScenarioAppError extends Schema.TaggedError<
  ScenarioAppError,
  { readonly brand: unique symbol }
>()("ScenarioAppError", {
  message: Schema.String,
  cause: Schema.optional(Schema.Unknown),
}) {}

const repoRoot = resolve(import.meta.dirname, "../..");
const serverEntry = resolve(repoRoot, "server.ts");

const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
const localLine = /^\s*(?:-\s*)?Local:\s+https?:\/\/\S+:(\d+)\s*$/;

export const parseServerPort = (line: string): Option.Option<number> => {
  const match = localLine.exec(line.replace(ansi, ""));
  return match === null ? Option.none() : Option.some(Number(match[1]));
};

const liveApiEnvironment = {
  STAR_WARS_API_URL: "https://swapi.dev/api",
  GHIBLI_API_URL: "https://ghibliapi.vercel.app",
  UI_EVENT_LOGGER: "noop",
} as const;

const waitUntilReady = (url: string) =>
  Effect.gen(function*() {
    const response = yield* Effect.tryPromise({
      try: () => fetch(url),
      catch: (cause) =>
        new ScenarioAppError({
          message: `The app did not answer at ${url}: ${String(cause)}`,
          cause,
        }),
    });
    if (!response.ok) {
      return yield* new ScenarioAppError({
        message: `The app answered ${response.status} at ${url}`,
      });
    }
  }).pipe(
    Effect.retry({ schedule: Schedule.spaced("250 millis"), times: 120 }),
    Effect.timeout("30 seconds"),
  );

const startServer = (env: Record<string, string>) =>
  Effect.gen(function*() {
    const child = yield* ChildProcess.make(
      process.execPath,
      ["--import", "tsx", serverEntry],
      {
        cwd: repoRoot,
        env: { ...env, PORT: "0", NODE_OPTIONS: undefined },
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
          const port = parseServerPort(line);
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
          new ScenarioAppError({
            message: "the server did not report its port within 30 seconds",
          }),
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
      const url = yield* startServer({ ...liveApiEnvironment, ...env });
      return ScenarioApp.of({ url });
    }),
  ).pipe(Layer.provide(NodeServices.layer));
