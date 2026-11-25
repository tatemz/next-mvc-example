import { Expect, type Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import { Universe } from "../../src/domain/FilmUniverse.model";
import { interactionPause } from "./Debug";
import { ScenarioApp, scenarioApp } from "./ScenarioApp";
import { ScenarioPage, scenarioPage } from "./ScenarioPage";

export type Session = {
  readonly page: Page.Page;
  readonly universe: Universe;
};

const universe = Bdd.capture("universe", Universe);
const text = Bdd.capture("text", Schema.String);
const theme = Bdd.capture("theme", Schema.String);
const query = Bdd.capture("query", Schema.String);
const characterName = Bdd.capture("characterName", Schema.String);
const filmTitle = Bdd.capture("filmTitle", Schema.String);
const transportName = Bdd.capture("transportName", Schema.String);
const characterId = Bdd.capture("characterId", Schema.String);
const filmOrder = Bdd.capture("filmOrder", Schema.String);
const transportKey = Bdd.capture("transportKey", Schema.String);

export const givenTheAppIsRunning = Bdd.given`the app is running`(
  Effect.fn("givenTheAppIsRunning")(function*() {
    return yield* ScenarioPage;
  }),
);

export const theUniverseIs = Bdd.given`the universe is ${universe}`(
  (
    { universe }: { readonly universe: Universe },
    page: Page.Page,
  ) => Effect.succeed({ page, universe }),
);

export const see = Bdd.then`I see "${text}"`(
  Effect.fn("see")(function*(
    { text }: { readonly text: string },
    session: Session,
  ) {
    yield* session.page
      .getByText(text, { exact: true })
      .pipe(Expect.toBeVisible);
    return session;
  }),
);

export const theThemeIs =
  Bdd.then`the page uses the "${theme}" theme`(
    Effect.fn("theThemeIs")(function*(
      { theme }: { readonly theme: string },
      session: Session,
    ) {
      yield* session.page
        .locator(`[data-theme="${theme}"]`)
        .pipe(Expect.toBeVisible);
      return session;
    }),
  );

export const openRoot = Bdd.when`I open the app root`(
  Effect.fn("openRoot")(function*(session: Session) {
    const app = yield* ScenarioApp;
    yield* session.page.goto(app.url, { waitUntil: "load" });
    yield* interactionPause;
    return session;
  }),
);

export const openHome = Bdd.when`I open the home`(
  Effect.fn("openHome")(function*(session: Session) {
    const app = yield* ScenarioApp;
    yield* session.page.goto(`${app.url}/${session.universe}`, {
      waitUntil: "load",
    });
    yield* interactionPause;
    return session;
  }),
);

export const openFunnel = Bdd.when`I open the funnel`(
  Effect.fn("openFunnel")(function*(session: Session) {
    const app = yield* ScenarioApp;
    yield* session.page.goto(
      `${app.url}/${session.universe}/funnel`,
      { waitUntil: "load" },
    );
    yield* interactionPause;
    return session;
  }),
);

export const openFunnelFromHome =
  Bdd.when`I open the funnel from the home`(
    Effect.fn("openFunnelFromHome")(function*(session: Session) {
      yield* session.page
        .getByRole("link", { name: "Build a dossier" })
        .click();
      yield* interactionPause;
      return session;
    }),
  );

export const chooseUniverse =
  Bdd.when`I choose the universe from the header`(
    Effect.fn("chooseUniverse")(function*(session: Session) {
      const label = session.universe === "star-wars"
        ? "Star Wars"
        : "Ghibli";
      yield* session.page.getByRole("link", { name: label }).click();
      yield* interactionPause;
      return session;
    }),
  );

export const searchFor = Bdd.when`I search for "${query}"`(
  Effect.fn("searchFor")(function*(
    { query }: { readonly query: string },
    session: Session,
  ) {
    yield* session.page.getByLabel("Character name").fill(query);
    yield* interactionPause;
    yield* session.page
      .getByRole("button", { name: "Search" })
      .click();
    yield* interactionPause;
    return session;
  }),
);

export const chooseCharacter =
  Bdd.when`I choose the character "${characterName}"`(
    Effect.fn("chooseCharacter")(function*(
      { characterName }: { readonly characterName: string },
      session: Session,
    ) {
      yield* session.page
        .getByRole("radio", { name: characterName })
        .click();
      yield* interactionPause;
      yield* session.page
        .getByRole("button", { name: "Choose character" })
        .click();
      yield* interactionPause;
      return session;
    }),
  );

export const chooseFilm = Bdd.when`I choose the film "${filmTitle}"`(
  Effect.fn("chooseFilm")(function*(
    { filmTitle }: { readonly filmTitle: string },
    session: Session,
  ) {
    yield* session.page
      .getByRole("radio", { name: filmTitle })
      .click();
    yield* interactionPause;
    yield* session.page
      .getByRole("button", { name: "Next: transport" })
      .click();
    yield* interactionPause;
    return session;
  }),
);

export const chooseTransport =
  Bdd.when`I choose the transport "${transportName}"`(
    Effect.fn("chooseTransport")(function*(
      { transportName }: { readonly transportName: string },
      session: Session,
    ) {
      yield* session.page
        .getByRole("radio", { name: transportName })
        .click();
      yield* interactionPause;
      yield* session.page
        .getByRole("button", { name: "Review dossier" })
        .click();
      yield* interactionPause;
      return session;
    }),
  );

export const openDossier = Bdd.when`I open the dossier`(
  Effect.fn("openDossier")(function*(session: Session) {
    yield* session.page
      .getByRole("link", { name: "Open dossier" })
      .click();
    yield* interactionPause;
    return session;
  }),
);

export const openResults =
  Bdd.when`I open the results for character "${characterId}", film "${filmOrder}", transport "${transportKey}"`(
    Effect.fn("openResults")(function*(
      {
        characterId,
        filmOrder,
        transportKey,
      }: {
        readonly characterId: string;
        readonly filmOrder: string;
        readonly transportKey: string;
      },
      session: Session,
    ) {
      const app = yield* ScenarioApp;
      const transport = transportKey === "missing"
        ? ""
        : `&transport=${transportKey}`;
      yield* session.page.goto(
        `${app.url}/${session.universe}/results?character=${characterId}&film=${filmOrder}${transport}`,
        { waitUntil: "load" },
      );
      yield* interactionPause;
      return session;
    }),
  );

export const environment = (feature: string, scenario: string) =>
  Layer.merge(
    scenarioApp({}),
    scenarioPage({ feature, index: 0, scenario }),
  );
