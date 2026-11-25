import { Effect, Layer } from "effect";
import { Bdd } from "effect-bdd";
import {
  whenIChooseTheCharacter,
  whenIChooseTheFilm,
  whenIChooseTheTransport,
  whenIOpenTheDossier,
  whenISearchTheFunnel,
} from "./Funnel.steps";
import { thenISee } from "./SharedSteps";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

export const givenTheGhibliFunnelIsOpen =
  Bdd.given`the Ghibli funnel is open`(
    Effect.fn("givenTheGhibliFunnelIsOpen")(function*() {
      const app = yield* ScenarioApp;
      const page = yield* ScenarioPage;
      yield* page.goto(`${app.url}/ghibli/funnel`, { waitUntil: "load" });
      yield* interactionPause;
      return page;
    }),
  );

const environment = (scenario: string, index: number) =>
  Layer.merge(
    scenarioApp({ CHARACTER_ID: "1" }),
    scenarioPage({ feature: "ghibli-funnel", index, scenario }),
  );

const buildDossier = Bdd.scenario("Building a dossier for Haku").pipe(
  givenTheGhibliFunnelIsOpen,
  whenISearchTheFunnel,
  whenIChooseTheCharacter,
  whenIChooseTheFilm,
  whenIChooseTheTransport,
  whenIOpenTheDossier,
  thenISee,
  thenISee,
  thenISee,
  thenISee,
  Bdd.provide(environment("haku-dossier", 0)),
);

export const ghibliDossier = Bdd.feature(
  "Building a Ghibli dossier",
).pipe(buildDossier);
