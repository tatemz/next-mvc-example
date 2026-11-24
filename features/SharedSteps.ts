import { Expect, type Page } from "@usestrider/browser";
import { Effect, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { ScenarioApp } from "./support/ScenarioApp";
import { ScenarioPage } from "./support/ScenarioPage";

const text = Bdd.capture("text", Schema.String);
const characterId = Bdd.capture("characterId", Schema.String);
const filmCount = Bdd.capture("filmCount", Schema.FiniteFromString);

export const givenTheAppIsOpen = Bdd.given`the app is open`(
  Effect.fn("givenTheAppIsOpen")(function*() {
    const app = yield* ScenarioApp;
    const page = yield* ScenarioPage;
    yield* page.goto(app.url, { waitUntil: "load" });
    return page;
  }),
);

export const whenIEnterTheCharacterId =
  Bdd.when`I enter "${characterId}" as the character id`(
    Effect.fn("whenIEnterTheCharacterId")(function*(
      { characterId }: { readonly characterId: string },
      page: Page.Page,
    ) {
      yield* page.getByLabel("Character id").fill(characterId);
      return page;
    }),
  );

export const whenILoadTheCharacter = Bdd.when`I load the character`(
  Effect.fn("whenILoadTheCharacter")(function*(page: Page.Page) {
    yield* page.getByRole("button", { name: "Load character" }).click();
    return page;
  }),
);

export const thenISee = Bdd.then`I see "${text}"`(
  Effect.fn("thenISee")(function*(
    { text }: { readonly text: string },
    page: Page.Page,
  ) {
    yield* page.getByText(text).pipe(Expect.toBeVisible);
    return page;
  }),
);

export const thenISeeFilms = Bdd.then`I see ${filmCount} films`(
  Effect.fn("thenISeeFilms")(function*(
    { filmCount }: { readonly filmCount: number },
    page: Page.Page,
  ) {
    const actual = yield* page.getByRole("listitem").count;
    if (actual !== filmCount) {
      return yield* Effect.fail(`expected ${filmCount} films, got ${actual}`);
    }
    return page;
  }),
);

export const thenTheCharacterIdFieldContains =
  Bdd.then`the character id field contains "${text}"`(
    Effect.fn("thenTheCharacterIdFieldContains")(function*(
      { text }: { readonly text: string },
      page: Page.Page,
    ) {
      const actual = yield* page.getByLabel("Character id").readValue;
      if (actual !== text) {
        return yield* Effect.fail(`expected "${text}", got "${actual}"`);
      }
      return page;
    }),
  );
