import { Layer } from "effect";
import { Bdd } from "effect-bdd";
import {
  givenTheAppIsOpen,
  thenISee,
  thenISeeFilms,
  thenTheCharacterIdFieldContains,
  whenIEnterTheCharacterId,
  whenILoadTheCharacter,
} from "./SharedSteps";
import { scenarioApp } from "./support/ScenarioApp";
import { scenarioPage } from "./support/ScenarioPage";

const feature = "character-lookup";

const environment = (scenario: string, index: number) =>
  Layer.merge(
    scenarioApp({ STAR_WARS_CHARACTER_ID: "1" }),
    scenarioPage({ feature, index, scenario }),
  );

const configuredCharacter = Bdd.scenario("The configured character loads").pipe(
  givenTheAppIsOpen,
  thenISee,
  thenISee,
  thenISeeFilms,
  Bdd.provide(environment("configured-character", 0)),
);

const anotherCharacter = Bdd.scenario("Loading another character").pipe(
  givenTheAppIsOpen,
  whenIEnterTheCharacterId,
  whenILoadTheCharacter,
  thenISee,
  thenISeeFilms,
  thenTheCharacterIdFieldContains,
  Bdd.provide(environment("another-character", 1)),
);

const invalidCharacterId = Bdd.scenario("Rejecting a non-numeric id").pipe(
  givenTheAppIsOpen,
  whenIEnterTheCharacterId,
  whenILoadTheCharacter,
  thenISee,
  thenTheCharacterIdFieldContains,
  Bdd.provide(environment("invalid-character-id", 2)),
);

export const characterLookup = Bdd.feature(
  "Looking up a Star Wars character",
).pipe(configuredCharacter, anotherCharacter, invalidCharacterId);
