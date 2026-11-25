import { Expect, type Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

const text = Bdd.capture("text", Schema.String);
const query = Bdd.capture("query", Schema.String);
const characterName = Bdd.capture("characterName", Schema.String);
const filmTitle = Bdd.capture("filmTitle", Schema.String);
const transportName = Bdd.capture("transportName", Schema.String);
const theme = Bdd.capture("theme", Schema.String);

const openGhibliFunnel = Bdd.given`the Ghibli funnel is open`(
  Effect.fn("openGhibliFunnel")(function*() {
    const app = yield* ScenarioApp;
    const page = yield* ScenarioPage;
    yield* page.goto(`${app.url}/ghibli/funnel`, { waitUntil: "load" });
    yield* interactionPause;
    return page;
  }),
);

const searchTheFunnel = Bdd.when`I search the funnel for "${query}"`(
  Effect.fn("searchTheFunnel")(function*(
    { query }: { readonly query: string },
    page: Page.Page,
  ) {
    yield* page.getByLabel("Character name").fill(query);
    yield* interactionPause;
    yield* page.getByRole("button", { name: "Search" }).click();
    yield* interactionPause;
    return page;
  }),
);

const chooseTheCharacter =
  Bdd.when`I choose the character "${characterName}"`(
    Effect.fn("chooseTheCharacter")(function*(
      { characterName }: { readonly characterName: string },
      page: Page.Page,
    ) {
      yield* page.getByRole("radio", { name: characterName }).click();
      yield* interactionPause;
      yield* page.getByRole("button", { name: "Choose character" }).click();
      yield* interactionPause;
      return page;
    }),
  );

const chooseTheFilm = Bdd.when`I choose the film "${filmTitle}"`(
  Effect.fn("chooseTheFilm")(function*(
    { filmTitle }: { readonly filmTitle: string },
    page: Page.Page,
  ) {
    yield* page.getByRole("radio", { name: filmTitle }).click();
    yield* interactionPause;
    yield* page.getByRole("button", { name: "Next: transport" }).click();
    yield* interactionPause;
    return page;
  }),
);

const chooseTheTransport =
  Bdd.when`I choose the transport "${transportName}"`(
    Effect.fn("chooseTheTransport")(function*(
      { transportName }: { readonly transportName: string },
      page: Page.Page,
    ) {
      yield* page.getByRole("radio", { name: transportName }).click();
      yield* interactionPause;
      yield* page.getByRole("button", { name: "Review dossier" }).click();
      yield* interactionPause;
      return page;
    }),
  );

const openTheDossier = Bdd.when`I open the dossier`(
  Effect.fn("openTheDossier")(function*(page: Page.Page) {
    yield* page.getByRole("link", { name: "Open dossier" }).click();
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
    scenarioPage({ feature: "ghibli-funnel", index, scenario }),
  );

const buildDossier = Bdd.scenario("Building a dossier for Haku").pipe(
  openGhibliFunnel,
  searchTheFunnel,
  chooseTheCharacter,
  chooseTheFilm,
  chooseTheTransport,
  openTheDossier,
  see("Your dossier"),
  see("Haku"),
  see("Spirited Away"),
  see("No transport selected"),
  theThemeIs("autumn"),
  Bdd.provide(environment("haku-dossier", 0)),
);

const buildVehicleDossier = Bdd.scenario(
  "Building a dossier with a vehicle",
).pipe(
  openGhibliFunnel,
  searchTheFunnel,
  chooseTheCharacter,
  chooseTheFilm,
  chooseTheTransport,
  openTheDossier,
  see("Your dossier"),
  see("Air Destroyer Goliath (Vehicle)"),
  theThemeIs("autumn"),
  Bdd.provide(environment("vehicle-dossier", 2)),
);

const noMatches = Bdd.scenario("Searching with no matches").pipe(
  openGhibliFunnel,
  searchTheFunnel,
  see("No characters matched that name."),
  Bdd.provide(environment("no-matches", 1)),
);

export const ghibliFunnel = Bdd.feature(
  "Building a Ghibli dossier",
).pipe(buildDossier, buildVehicleDossier, noMatches);
