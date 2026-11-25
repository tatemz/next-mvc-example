import { Expect, type Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

const text = Bdd.capture("text", Schema.String);
const theme = Bdd.capture("theme", Schema.String);

const givenTheAppIsRunning = Bdd.given`the app is running`(
  Effect.fn("givenTheAppIsRunning")(function*() {
    return yield* ScenarioPage;
  }),
);

const openGhibliHome = Effect.fn("openGhibliHome")(function*() {
  const app = yield* ScenarioApp;
  const page = yield* ScenarioPage;
  yield* page.goto(`${app.url}/ghibli`, { waitUntil: "load" });
  yield* interactionPause;
  return page;
});

const givenTheGhibliHomeIsOpen =
  Bdd.given`the Ghibli home is open`(openGhibliHome);

const whenIOpenTheGhibliHome =
  Bdd.when`I open the Ghibli home`(openGhibliHome);

const openTheFunnelFromTheSplash =
  Bdd.when`I open the funnel from the splash`(
    Effect.fn("openTheFunnelFromTheSplash")(function*(page: Page.Page) {
      yield* page.getByRole("link", { name: "Build a dossier" }).click();
      yield* interactionPause;
      return page;
    }),
  );

const see = (expected: string) =>
  Bdd.then`I see "${text}"`(
    Effect.fn("see")(function*(
      { text }: { readonly text: string },
      page: Page.Page,
    ) {
      if (text !== expected) {
        return yield* Effect.fail(
          `expected "${expected}", got "${text}"`,
        );
      }
      yield* page.getByText(text, { exact: true }).pipe(
        Expect.toBeVisible,
      );
      return page;
    }),
  );

const theThemeIs = (expected: string) =>
  Bdd.then`the page uses the "${theme}" theme`(
    Effect.fn("theThemeIs")(function*(
      { theme }: { readonly theme: string },
      page: Page.Page,
    ) {
      if (theme !== expected) {
        return yield* Effect.fail(
          `expected "${expected}", got "${theme}"`,
        );
      }
      yield* page
        .locator(`[data-theme="${theme}"]`)
        .pipe(Expect.toBeVisible);
      return page;
    }),
  );

const environment = (scenario: string, index: number) =>
  Layer.merge(
    scenarioApp({}),
    scenarioPage({ feature: "ghibli-home", index, scenario }),
  );

const splash = Bdd.scenario(
  "The splash introduces the Ghibli experience",
).pipe(
  givenTheAppIsRunning,
  whenIOpenTheGhibliHome,
  see("Studio Ghibli character dossier"),
  see("Build a dossier"),
  theThemeIs("autumn"),
  Bdd.provide(environment("splash", 0)),
);

const funnelFromSplash = Bdd.scenario(
  "The splash CTA opens the funnel",
).pipe(
  givenTheGhibliHomeIsOpen,
  openTheFunnelFromTheSplash,
  see("Find a character"),
  theThemeIs("autumn"),
  Bdd.provide(environment("splash-to-funnel", 1)),
);

export const ghibliHome = Bdd.feature(
  "The Studio Ghibli splash page",
).pipe(splash, funnelFromSplash);
