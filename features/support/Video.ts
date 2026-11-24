import { ChildProcess } from "effect/process";
import { Deferred, Effect, Ref, Schedule, Stream } from "effect";
import type { Page } from "@usestrider/browser";
import { Capability } from "@usestrider/browser";

export const recordVideo = Effect.fn("recordVideo")(function*(
  page: Page.Page,
  file: string,
) {
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
      Effect.ignore,
    ),
  );
});
