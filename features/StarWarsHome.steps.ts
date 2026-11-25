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

const openStarWarsHome = Effect.fn("openStarWarsHome")(function*() {
  const app = yield* ScenarioApp;
  const page = yield* ScenarioPage;
  yield* page.goto(`${app.url}/star-wars`, { waitUntil: "load" });
  yield* interactionPause;
  return page;
});

const givenTheStarWarsHomeIsOpen =
  Bdd.given`the Star Wars home is open`(openStarWarsHome);

const whenIOpenTheStarWarsHome =
  Bdd.when`I open the Star Wars home`(openStarWarsHome);

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
    scenarioPage({ feature: "star-wars-home", index, scenario }),
  );

const splash = Bdd.scenario(
  "The splash introduces the Star Wars experience",
).pipe(
  givenTheAppIsRunning,
  whenIOpenTheStarWarsHome,
  see("Star Wars character dossier"),
  see("Build a dossier"),
  theThemeIs("night"),
  Bdd.provide(environment("splash", 0)),
);

const funnelFromSplash = Bdd.scenario(
  "The splash CTA opens the funnel",
).pipe(
  givenTheStarWarsHomeIsOpen,
  openTheFunnelFromTheSplash,
  see("Find a character"),
  theThemeIs("night"),
  Bdd.provide(environment("splash-to-funnel", 1)),
);

export const starWarsHome = Bdd.feature(
  "The Star Wars splash page",
).pipe(splash, funnelFromSplash);
