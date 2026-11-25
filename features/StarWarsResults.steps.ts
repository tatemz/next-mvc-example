import { Expect, type Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

const text = Bdd.capture("text", Schema.String);
const transportKey = Bdd.capture("transportKey", Schema.String);
const theme = Bdd.capture("theme", Schema.String);

const givenTheAppIsRunning = Bdd.given`the app is running`(
  Effect.fn("givenTheAppIsRunning")(function*() {
    return yield* ScenarioPage;
  }),
);

const openCompleteResults = Bdd.when`I open the complete results`(
  Effect.fn("openCompleteResults")(function*(page: Page.Page) {
    const app = yield* ScenarioApp;
    yield* page.goto(
      `${app.url}/star-wars/results?character=1&film=4&transport=starship-12`,
      { waitUntil: "load" },
    );
    yield* interactionPause;
    return page;
  }),
);

const openResultsWithoutTransport =
  Bdd.when`I open the results without a transport`(
    Effect.fn("openResultsWithoutTransport")(function*(page: Page.Page) {
      const app = yield* ScenarioApp;
      yield* page.goto(`${app.url}/star-wars/results?character=1&film=4`, {
        waitUntil: "load",
      });
      yield* interactionPause;
      return page;
    }),
  );

const openResultsWithTransport =
  Bdd.when`I open the results with transport "${transportKey}"`(
    Effect.fn("openResultsWithTransport")(function*(
      { transportKey }: { readonly transportKey: string },
      page: Page.Page,
    ) {
      const app = yield* ScenarioApp;
      yield* page.goto(
        `${app.url}/star-wars/results?character=1&film=4&transport=${transportKey}`,
        { waitUntil: "load" },
      );
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
    scenarioPage({ feature: "star-wars-results", index, scenario }),
  );

const completeDossier = Bdd.scenario("Opening a complete dossier").pipe(
  givenTheAppIsRunning,
  openCompleteResults,
  see("Your dossier"),
  see("Tatooine"),
  see("X-wing (Starship)"),
  theThemeIs("night"),
  Bdd.provide(environment("complete-dossier", 0)),
);

const missingTransport = Bdd.scenario(
  "Rejecting a dossier without a transport",
).pipe(
  givenTheAppIsRunning,
  openResultsWithoutTransport,
  see("Dossier not found"),
  see("Build a dossier"),
  Bdd.provide(environment("missing-transport", 1)),
);

const unknownTransport = Bdd.scenario("Rejecting an unknown transport").pipe(
  givenTheAppIsRunning,
  openResultsWithTransport,
  see("Dossier not found"),
  Bdd.provide(environment("unknown-transport", 2)),
);

const noTransport = Bdd.scenario(
  "Opening a dossier without a transport",
).pipe(
  givenTheAppIsRunning,
  openResultsWithTransport,
  see("Your dossier"),
  see("No transport selected"),
  Bdd.provide(environment("no-transport", 3)),
);

export const starWarsResults = Bdd.feature(
  "Opening a Star Wars dossier",
).pipe(completeDossier, missingTransport, unknownTransport, noTransport);
