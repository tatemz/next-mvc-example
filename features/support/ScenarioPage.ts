import { NodeServices } from "@effect/platform-node";
import { Browser, type Page } from "@usestrider/browser";
import { Chromium } from "@usestrider/browser/chromium";
import { Config, Context, Effect, FileSystem, Layer, Match, Ref } from "effect";
import { debugMode } from "./Debug";
import { recordVideo, type ScenarioRecording } from "./Video";

export class ScenarioPage extends Context.Service<ScenarioPage, Page.Page>()(
  "next-mvc-example/test/ScenarioPage",
) {}

const ChromiumLive = Chromium.layerConfig({
  executablePath: Config.String("CHROMIUM_PATH"),
});

const recordingIndex = Ref.makeUnsafe(0);

export const scenarioPage = (recording: ScenarioRecording) =>
  Layer.effect(
    ScenarioPage,
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.makeDirectory("artifacts", { recursive: true });
      const index = yield* Ref.updateAndGet(
        recordingIndex,
        (current) => current + 1,
      );
      const page = yield* Browser.newPage({
        emulation: { viewport: { width: 1280, height: 720 } },
      });
      if (debugMode) {
        yield* recordVideo(page, { ...recording, index });
      }
      yield* Effect.addFinalizer((exit) =>
        Match.valueTags(exit, {
          Failure: () =>
            page.screenshot({ area: "fullPage" }).pipe(
              Effect.flatMap((png) =>
                fs.writeFile(
                  `artifacts/${String(index).padStart(2, "0")}-${recording.scenario}.png`,
                  png,
                ),
              ),
              Effect.ignore,
            ),
          Success: () => Effect.void,
        }),
      );
      return page;
    }),
  ).pipe(Layer.provide(ChromiumLive), Layer.provide(NodeServices.layer));
