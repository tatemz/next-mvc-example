import { NodeServices } from "@effect/platform-node";
import { Browser, type Page } from "@usestrider/browser";
import { Chromium } from "@usestrider/browser/chromium";
import { Config, Context, Effect, Exit, FileSystem, Layer } from "effect";
import { recordVideo } from "./Video";

export class ScenarioPage extends Context.Service<ScenarioPage, Page.Page>()(
  "next-mvc-example/test/ScenarioPage",
) {}

const ChromiumLive = Chromium.layerConfig({
  executablePath: Config.String("CHROMIUM_PATH"),
});

export const scenarioPage = (name: string) =>
  Layer.effect(
    ScenarioPage,
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.makeDirectory("artifacts", { recursive: true });
      const page = yield* Browser.newPage({
        emulation: { viewport: { width: 1280, height: 720 } },
      });
      yield* recordVideo(page, `artifacts/${name}.webm`);
      yield* Effect.addFinalizer((exit) =>
        Exit.isFailure(exit)
          ? page.screenshot({ area: "fullPage" }).pipe(
              Effect.flatMap((png) =>
                fs.writeFile(`artifacts/${name}.png`, png),
              ),
              Effect.ignore,
            )
          : Effect.void,
      );
      return page;
    }),
  ).pipe(Layer.provide(ChromiumLive), Layer.provide(NodeServices.layer));
