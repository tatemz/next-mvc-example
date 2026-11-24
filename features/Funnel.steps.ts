import type { Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { thenISee } from "./SharedSteps";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

const funnelQuery = Bdd.capture("funnelQuery", Schema.String);
const characterName = Bdd.capture("characterName", Schema.String);
const filmTitle = Bdd.capture("filmTitle", Schema.String);
const transportName = Bdd.capture("transportName", Schema.String);

export const givenTheFunnelIsOpen = Bdd.given`the funnel is open`(
  Effect.fn("givenTheFunnelIsOpen")(function*() {
    const app = yield* ScenarioApp;
    const page = yield* ScenarioPage;
    yield* page.goto(`${app.url}/funnel`, { waitUntil: "load" });
    yield* interactionPause;
    return page;
  }),
);

export const whenISearchTheFunnel =
  Bdd.when`I search the funnel for "${funnelQuery}"`(
    Effect.fn("whenISearchTheFunnel")(function*(
      { funnelQuery }: { readonly funnelQuery: string },
      page: Page.Page,
    ) {
      yield* page.getByLabel("Character name").fill(funnelQuery);
      yield* interactionPause;
      yield* page.getByRole("button", { name: "Search" }).click();
      yield* interactionPause;
      return page;
    }),
  );

export const whenIChooseTheCharacter =
  Bdd.when`I choose the character "${characterName}"`(
    Effect.fn("whenIChooseTheCharacter")(function*(
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

export const whenIChooseTheFilm = Bdd.when`I choose the film "${filmTitle}"`(
  Effect.fn("whenIChooseTheFilm")(function*(
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

export const whenIChooseTheTransport =
  Bdd.when`I choose the transport "${transportName}"`(
    Effect.fn("whenIChooseTheTransport")(function*(
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

export const whenIOpenTheDossier = Bdd.when`I open the dossier`(
  Effect.fn("whenIOpenTheDossier")(function*(page: Page.Page) {
    yield* page.getByRole("link", { name: "Open dossier" }).click();
    yield* interactionPause;
    return page;
  }),
);

const environment = (scenario: string, index: number) =>
  Layer.merge(
    scenarioApp({ STAR_WARS_CHARACTER_ID: "1" }),
    scenarioPage({ feature: "funnel", index, scenario }),
  );

const buildDossier = Bdd.scenario(
  "Building a dossier for Luke Skywalker",
).pipe(
  givenTheFunnelIsOpen,
  whenISearchTheFunnel,
  whenIChooseTheCharacter,
  whenIChooseTheFilm,
  whenIChooseTheTransport,
  thenISee,
  thenISee,
  whenIOpenTheDossier,
  thenISee,
  thenISee,
  thenISee,
  Bdd.provide(environment("luke-dossier", 0)),
);

export const buildingADossier = Bdd.feature(
  "Building a character dossier",
).pipe(buildDossier);
