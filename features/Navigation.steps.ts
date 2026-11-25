import { Expect, type Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

const text = Bdd.capture("text", Schema.String);
const universe = Bdd.capture("universe", Schema.String);
const theme = Bdd.capture("theme", Schema.String);

const givenTheAppIsRunning = Bdd.given`the app is running`(
  Effect.fn("givenTheAppIsRunning")(function*() {
    return yield* ScenarioPage;
  }),
);

const openTheAppRoot = Bdd.when`I open the app root`(
  Effect.fn("openTheAppRoot")(function*(page: Page.Page) {
    const app = yield* ScenarioApp;
    yield* page.goto(app.url, { waitUntil: "load" });
    yield* interactionPause;
    return page;
  }),
);

const openStarWarsHome = Bdd.given`the Star Wars home is open`(
  Effect.fn("openStarWarsHome")(function*() {
    const app = yield* ScenarioApp;
    const page = yield* ScenarioPage;
    yield* page.goto(`${app.url}/star-wars`, { waitUntil: "load" });
    yield* interactionPause;
    return page;
  }),
);

const chooseUniverse = Bdd.when`I choose the "${universe}" universe`(
  Effect.fn("chooseUniverse")(function*(
    { universe }: { readonly universe: string },
    page: Page.Page,
  ) {
    yield* page.getByRole("link", { name: universe }).click();
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
      yield* page.getByText(text).pipe(Expect.toBeVisible);
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
    scenarioApp({ CHARACTER_ID: "1" }),
    scenarioPage({ feature: "navigation", index, scenario }),
  );

const rootOpensStarWars = Bdd.scenario(
  "The root opens the Star Wars experience",
).pipe(
  givenTheAppIsRunning,
  openTheAppRoot,
  see("Luke Skywalker"),
  theThemeIs("night"),
  Bdd.provide(environment("root-opens-star-wars", 0)),
);

const headerSwitchesToGhibli = Bdd.scenario(
  "The header switches to Ghibli",
).pipe(
  openStarWarsHome,
  chooseUniverse,
  see("Haku"),
  theThemeIs("autumn"),
  Bdd.provide(environment("header-switches-to-ghibli", 1)),
);

export const navigation = Bdd.feature(
  "Moving between the two experiences",
).pipe(rootOpensStarWars, headerSwitchesToGhibli);
