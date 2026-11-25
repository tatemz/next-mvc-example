import { Expect, type Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { interactionPause } from "./support/Debug";
import { ScenarioApp, scenarioApp } from "./support/ScenarioApp";
import { ScenarioPage, scenarioPage } from "./support/ScenarioPage";

const text = Bdd.capture("text", Schema.String);
const characterId = Bdd.capture("characterId", Schema.String);
const filmCount = Bdd.capture("filmCount", Schema.FiniteFromString);
const theme = Bdd.capture("theme", Schema.String);

const openStarWarsHome = Bdd.given`the Star Wars home is open`(
  Effect.fn("openStarWarsHome")(function*() {
    const app = yield* ScenarioApp;
    const page = yield* ScenarioPage;
    yield* page.goto(`${app.url}/star-wars`, { waitUntil: "load" });
    yield* interactionPause;
    return page;
  }),
);

const enterCharacterId =
  Bdd.when`I enter "${characterId}" as the character id`(
    Effect.fn("enterCharacterId")(function*(
      { characterId }: { readonly characterId: string },
      page: Page.Page,
    ) {
      yield* page.getByLabel("Character id").fill(characterId);
      yield* interactionPause;
      return page;
    }),
  );

const loadTheCharacter = Bdd.when`I load the character`(
  Effect.fn("loadTheCharacter")(function*(page: Page.Page) {
    yield* page.getByRole("button", { name: "Load character" }).click();
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

const seeFilms = (expected: number) =>
  Bdd.then`I see ${filmCount} films`(
    Effect.fn("seeFilms")(function*(
      { filmCount }: { readonly filmCount: number },
      page: Page.Page,
    ) {
      if (filmCount !== expected) {
        return yield* Effect.fail(
          `expected ${expected} films, got ${filmCount}`,
        );
      }
      yield* page.getByRole("listitem").first.pipe(Expect.toBeVisible);
      const actual = yield* page.getByRole("listitem").count;
      if (actual !== expected) {
        return yield* Effect.fail(
          `expected ${expected} films, got ${actual}`,
        );
      }
      return page;
    }),
  );

const theCharacterIdFieldContains = (expected: string) =>
  Bdd.then`the character id field contains "${text}"`(
    Effect.fn("theCharacterIdFieldContains")(function*(
      { text }: { readonly text: string },
      page: Page.Page,
    ) {
      if (text !== expected) {
        return yield* Effect.fail(
          `expected "${expected}", got "${text}"`,
        );
      }
      yield* page.getByLabel("Character id").pipe(Expect.toBeVisible);
      const actual = yield* page.getByLabel("Character id").readValue;
      if (actual !== expected) {
        return yield* Effect.fail(
          `expected "${expected}", got "${actual}"`,
        );
      }
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
    scenarioPage({ feature: "star-wars-home", index, scenario }),
  );

const configuredCharacter = Bdd.scenario("The configured character loads").pipe(
  openStarWarsHome,
  loadTheCharacter,
  see("Luke Skywalker"),
  see("A New Hope"),
  seeFilms(4),
  theThemeIs("night"),
  Bdd.provide(environment("configured-character", 0)),
);

const anotherCharacter = Bdd.scenario("Loading another character").pipe(
  openStarWarsHome,
  enterCharacterId,
  loadTheCharacter,
  see("R2-D2"),
  seeFilms(6),
  theCharacterIdFieldContains("3"),
  Bdd.provide(environment("another-character", 1)),
);

const invalidCharacterId = Bdd.scenario("Rejecting a non-numeric id").pipe(
  openStarWarsHome,
  enterCharacterId,
  loadTheCharacter,
  see("Character id must be a positive whole number."),
  theCharacterIdFieldContains("abc"),
  Bdd.provide(environment("invalid-character-id", 2)),
);

const unknownCharacter = Bdd.scenario("Reporting an unknown character").pipe(
  openStarWarsHome,
  enterCharacterId,
  loadTheCharacter,
  see("The character could not be loaded."),
  see("Try again"),
  Bdd.provide(environment("unknown-character", 3)),
);

export const starWarsHome = Bdd.feature(
  "Looking up a Star Wars character",
).pipe(
  configuredCharacter,
  anotherCharacter,
  invalidCharacterId,
  unknownCharacter,
);
