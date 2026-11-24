import type { Page } from "@usestrider/browser";
import { Capability } from "@usestrider/browser";
import {
  Cause,
  Deferred,
  Effect,
  FileSystem,
  Ref,
  Schedule,
  Stream,
} from "effect";
import { ChildProcess } from "effect/process";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type ScenarioRecording = {
  readonly feature: string;
  readonly index: number;
  readonly scenario: string;
};

const partsRoot = join(tmpdir(), `next-mvc-e2e-video-${randomUUID()}`);
const artifacts = resolve("artifacts");

const partPath = (recording: ScenarioRecording) =>
  join(
    partsRoot,
    recording.feature,
    `${String(recording.index).padStart(2, "0")}-${recording.scenario}.webm`,
  );

const partIndex = (name: string) => Number(name.slice(0, name.indexOf("-")));

const joinFeatureVideo = Effect.fn("joinFeatureVideo")(function*(
  feature: string,
) {
  const fs = yield* FileSystem.FileSystem;
  const directory = join(partsRoot, feature);
  const names = yield* fs.readDirectory(directory);
  const parts = names
    .filter((name) => name.endsWith(".webm"))
    .sort((left, right) => partIndex(left) - partIndex(right));
  const list = join(directory, "parts.txt");
  const contents = parts
    .map((name) => `file '${join(directory, name)}'`)
    .join("\n");
  yield* fs.writeFileString(list, `${contents}\n`);
  yield* fs.makeDirectory(artifacts, { recursive: true });
  yield* Effect.tryPromise({
    try: () =>
      execFileAsync("ffmpeg", [
        "-loglevel",
        "error",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        list,
        "-c",
        "copy",
        "-y",
        join(artifacts, `${feature}.webm`),
      ]),
    catch: (cause) =>
      new Error(`Could not join the ${feature} video: ${String(cause)}`),
  });
});

export const recordVideo = Effect.fn("recordVideo")(function*(
  page: Page.Page,
  recording: ScenarioRecording,
) {
  const fs = yield* FileSystem.FileSystem;
  const file = partPath(recording);
  yield* fs.makeDirectory(dirname(file), { recursive: true });
  const screencast = yield* page.capability(Capability.Screencast);
  const latest = yield* Ref.make<Uint8Array | undefined>(undefined);
  yield* screencast.frames.pipe(
    Stream.runForEach((frame) => Ref.set(latest, frame.jpeg)),
    Effect.ignore,
    Effect.forkScoped,
  );
  const stop = yield* Deferred.make<void>();
  const frames = Stream.fromSchedule(Schedule.fixed("40 millis")).pipe(
    Stream.mapEffect(() => Ref.get(latest)),
    Stream.filter((jpeg) => jpeg !== undefined),
    Stream.interruptWhen(Deferred.await(stop)),
  );
  const ffmpeg = yield* ChildProcess.make({ stdin: frames, stderr: "inherit" })`
    ffmpeg -loglevel error -f mjpeg -framerate 25 -i pipe:0
      -c:v libvpx-vp9 -crf 36 -b:v 0 -deadline realtime -cpu-used 8
      -y ${file}`;
  yield* Effect.addFinalizer(() =>
    Effect.sleep("1 second").pipe(
      Effect.andThen(Deferred.succeed(stop, undefined)),
      Effect.andThen(ffmpeg.exitCode),
      Effect.andThen(joinFeatureVideo(recording.feature)),
      Effect.catchCause((cause) =>
        Effect.logWarning(
          `Could not record the ${recording.feature} video: ${Cause.pretty(cause)}`,
        ),
      ),
    ),
  );
});
