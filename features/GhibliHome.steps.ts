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

const openGhibliHome = Bdd.given`the Ghibli home is open`(
  Effect.fn("openGhibliHome")(function*() {
    const app = yield* ScenarioApp;
    const page = yield* ScenarioPage;
    yield* page.goto(`${app.url}/ghibli`, { waitUntil: "load" });
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

const seeFilm = (expected: number) =>
  Bdd.then`I see ${filmCount} film`(
    Effect.fn("seeFilm")(function*(
      { filmCount }: { readonly filmCount: number },
      page: Page.Page,
    ) {
      if (filmCount !== expected) {
        return yield* Effect.fail(
          `expected ${expected} film, got ${filmCount}`,
        );
      }
      yield* page.getByRole("listitem").first.pipe(Expect.toBeVisible);
      const actual = yield* page.getByRole("listitem").count;
      if (actual !== expected) {
        return yield* Effect.fail(
          `expected ${expected} film, got ${actual}`,
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
    scenarioPage({ feature: "ghibli-home", index, scenario }),
  );

const configuredCharacter = Bdd.scenario("The configured character loads").pipe(
  openGhibliHome,
  loadTheCharacter,
  see("Haku"),
  see("Spirited Away"),
  see("Dragon"),
  seeFilm(1),
  theThemeIs("autumn"),
  Bdd.provide(environment("configured-character", 0)),
);

const unknownCharacter = Bdd.scenario("Reporting an unknown character").pipe(
  openGhibliHome,
  enterCharacterId,
  loadTheCharacter,
  see("The character could not be loaded."),
  see("Try again"),
  Bdd.provide(environment("unknown-character", 1)),
);

export const ghibliHome = Bdd.feature(
  "Looking up a Ghibli character",
).pipe(configuredCharacter, unknownCharacter);
