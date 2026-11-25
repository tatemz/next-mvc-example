import { Effect, Layer } from "effect";
import { Bdd } from "effect-bdd";
import { givenTheAppIsOpen, thenISee, thenISeeFilm } from "./SharedSteps";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

export const whenIOpenTheGhibliApp = Bdd.when`I open the Ghibli app`(
  Effect.fn("whenIOpenTheGhibliApp")(function*() {
    const app = yield* ScenarioApp;
    const page = yield* ScenarioPage;
    yield* page.goto(`${app.url}/ghibli`, { waitUntil: "load" });
    yield* interactionPause;
    return page;
  }),
);

const environment = (scenario: string, index: number) =>
  Layer.merge(
    scenarioApp({ CHARACTER_ID: "1" }),
    scenarioPage({ feature: "datasets", index, scenario }),
  );

const ghibliHome = Bdd.scenario(
  "The Ghibli layer serves the same home page",
).pipe(
  givenTheAppIsOpen,
  whenIOpenTheGhibliApp,
  thenISee,
  thenISee,
  thenISee,
  thenISeeFilm,
  Bdd.provide(environment("ghibli-home", 0)),
);

export const twoDependencyLayers = Bdd.feature(
  "Two dependency layers",
).pipe(ghibliHome);
