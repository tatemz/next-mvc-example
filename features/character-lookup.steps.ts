import { Layer } from "effect";
import { Bdd } from "effect-bdd";
import {
  givenTheAppIsOpen,
  thenISee,
  thenISeeFilms,
  thenTheCharacterIdFieldContains,
  whenIEnterTheCharacterId,
  whenILoadTheCharacter,
} from "./steps";
import { scenarioApp } from "./support/scenario-app";
import { scenarioPage } from "./support/scenario-page";

const environment = (name: string) =>
  Layer.merge(
    scenarioApp({ STAR_WARS_CHARACTER_ID: "1" }),
    scenarioPage(name),
  );

const configuredCharacter = Bdd.scenario("The configured character loads").pipe(
  givenTheAppIsOpen,
  thenISee,
  thenISee,
  thenISeeFilms,
  Bdd.provide(environment("configured-character")),
);

const anotherCharacter = Bdd.scenario("Loading another character").pipe(
  givenTheAppIsOpen,
  whenIEnterTheCharacterId,
  whenILoadTheCharacter,
  thenISee,
  thenISeeFilms,
  thenTheCharacterIdFieldContains,
  Bdd.provide(environment("another-character")),
);

const invalidCharacterId = Bdd.scenario("Rejecting a non-numeric id").pipe(
  givenTheAppIsOpen,
  whenIEnterTheCharacterId,
  whenILoadTheCharacter,
  thenISee,
  thenTheCharacterIdFieldContains,
  Bdd.provide(environment("invalid-character-id")),
);

export const characterLookup = Bdd.feature(
  "Looking up a Star Wars character",
).pipe(configuredCharacter, anotherCharacter, invalidCharacterId);
