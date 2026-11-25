import { Expect, type Page } from "@usestrider/browser";
import { Effect, Layer, Schema } from "effect";
import { Bdd } from "effect-bdd";
import {
  Universe,
  Universes,
} from "../../src/domain/FilmUniverse.model";
import {
  DefaultLocale,
  type Locale,
  LocaleLabels,
  localeHref,
} from "../../src/i18n/Locale";
import { LocaleSchema } from "../../src/i18n/Locale.schema";
import {
  type CatalogMode,
  CatalogControl,
  CatalogModes,
} from "./CatalogStub";
import { interactionPause } from "./Debug";
import { ScenarioApp, scenarioApp } from "./ScenarioApp";
import { ScenarioPage, scenarioPage } from "./ScenarioPage";

export type Session = {
  readonly page: Page.Page;
  readonly universe: Universe;
  readonly locale: Locale;
};

const universe = Bdd.capture("universe", Universe);
const targetUniverse = Bdd.capture("targetUniverse", Universe);
const locale = Bdd.capture("locale", LocaleSchema);
const text = Bdd.capture("text", Schema.String);
const theme = Bdd.capture("theme", Schema.String);
const query = Bdd.capture("query", Schema.String);
const characterName = Bdd.capture("characterName", Schema.String);
const filmTitle = Bdd.capture("filmTitle", Schema.String);
const transportName = Bdd.capture("transportName", Schema.String);
const characterId = Bdd.capture("characterId", Schema.String);
const filmOrder = Bdd.capture("filmOrder", Schema.String);
const transportKey = Bdd.capture("transportKey", Schema.String);
const path = Bdd.capture("path", Schema.String);
const address = Bdd.capture("address", Schema.String);
const linkLabel = Bdd.capture("linkLabel", Schema.String);
const linkHref = Bdd.capture("linkHref", Schema.String);
const catalogMode = Bdd.capture(
  "catalogMode",
  Schema.Literals([
    CatalogModes.Working,
    CatalogModes.Unavailable,
  ]),
);

const universeLabel = (universe: Universe) =>
  universe === Universes.StarWars ? "Star Wars" : "Ghibli";

const openFunnelPage = (session: Session) =>
  Effect.gen(function*() {
    const app = yield* ScenarioApp;
    yield* session.page.goto(
      `${app.url}${
        localeHref(session.locale, `/${session.universe}/funnel`)
      }`,
      { waitUntil: "load" },
    );
    yield* interactionPause;
    return session;
  });

const searchFunnel = (session: Session, value: string) =>
  Effect.gen(function*() {
    yield* session.page.locator('input[name="query"]').fill(value);
    yield* interactionPause;
    yield* session.page.locator('form button[type="submit"]').click();
    yield* interactionPause;
    return session;
  });

const chooseFunnelCharacter = (session: Session, value: string) =>
  Effect.gen(function*() {
    yield* session.page
      .getByRole("radio", { name: value })
      .click();
    yield* interactionPause;
    yield* session.page.locator('form button[type="submit"]').click();
    yield* interactionPause;
    return session;
  });

const chooseFunnelFilm = (session: Session, value: string) =>
  Effect.gen(function*() {
    yield* session.page
      .getByRole("radio", { name: value })
      .click();
    yield* interactionPause;
    yield* session.page.locator('form button[type="submit"]').click();
    yield* interactionPause;
    return session;
  });

const chooseFunnelTransport = (session: Session, value: string) =>
  Effect.gen(function*() {
    yield* session.page
      .getByRole("radio", { name: value })
      .click();
    yield* interactionPause;
    yield* session.page.locator('form button[type="submit"]').click();
    yield* interactionPause;
    return session;
  });

const setRadioValue = (
  session: Session,
  name: string,
  value: string,
) =>
  Effect.gen(function*() {
    const radio = session.page.locator(`input[name="${name}"]`).nth(0);
    yield* radio.pipe(Expect.toBeVisible);
    yield* radio.evaluate((element, next) => {
      const input = element as HTMLInputElement;
      input.value = next;
      input.checked = true;
    }, value);
  });

const chooseFunnelCharacterWithId = (
  session: Session,
  value: string,
) =>
  Effect.gen(function*() {
    yield* setRadioValue(
      session,
      "characterId",
      value === "empty" ? "" : value,
    );
    yield* session.page.locator('form button[type="submit"]').click();
    yield* interactionPause;
    return session;
  });

const chooseFunnelFilmWithOrder = (
  session: Session,
  value: string,
) =>
  Effect.gen(function*() {
    yield* setRadioValue(
      session,
      "order",
      value === "empty" ? "" : value,
    );
    yield* session.page.locator('form button[type="submit"]').click();
    yield* interactionPause;
    return session;
  });

const chooseFunnelTransportWithKey = (
  session: Session,
  value: string,
) =>
  Effect.gen(function*() {
    yield* setRadioValue(
      session,
      "transportKey",
      value === "empty" ? "" : value,
    );
    yield* session.page.locator('form button[type="submit"]').click();
    yield* interactionPause;
    return session;
  });

export const givenTheAppIsRunning = Bdd.given`the app is running`(
  Effect.fn("givenTheAppIsRunning")(function*() {
    const page = yield* ScenarioPage;
    return { page, universe: Universes.StarWars, locale: DefaultLocale };
  }),
);

export const theUniverseIs = Bdd.given`the universe is ${universe}`(
  (
    { universe }: { readonly universe: Universe },
    session: Session,
  ) => Effect.succeed({ ...session, universe }),
);

export const theLocaleIs = Bdd.given`the locale is ${locale}`(
  (
    { locale }: { readonly locale: Locale },
    session: Session,
  ) => Effect.succeed({ ...session, locale }),
);

export const theCatalogueIs =
  Bdd.given`the catalogue is ${catalogMode}`(
    Effect.fn("theCatalogueIs")(function*(
      { catalogMode }: { readonly catalogMode: CatalogMode },
      session: Session,
    ) {
      const control = yield* CatalogControl;
      yield* control.set(catalogMode);
      return session;
    }),
  );

export const givenFunnelIsOpen = Bdd.given`I am on the funnel`(
  Effect.fn("givenFunnelIsOpen")(function*(session: Session) {
    return yield* openFunnelPage(session);
  }),
);

export const givenSearchedFor =
  Bdd.given`I searched for "${query}"`(
    Effect.fn("givenSearchedFor")(function*(
      { query }: { readonly query: string },
      session: Session,
    ) {
      return yield* searchFunnel(
        yield* openFunnelPage(session),
        query,
      );
    }),
  );

export const givenChoseCharacter =
  Bdd.given`I chose the character "${characterName}"`(
    Effect.fn("givenChoseCharacter")(function*(
      { characterName }: { readonly characterName: string },
      session: Session,
    ) {
      const onSearch = yield* searchFunnel(
        yield* openFunnelPage(session),
        characterName,
      );
      return yield* chooseFunnelCharacter(onSearch, characterName);
    }),
  );

export const givenChoseFilm =
  Bdd.given`I chose the film "${filmTitle}" for the character "${characterName}"`(
    Effect.fn("givenChoseFilm")(function*(
      {
        filmTitle,
        characterName,
      }: {
        readonly filmTitle: string;
        readonly characterName: string;
      },
      session: Session,
    ) {
      const onSearch = yield* searchFunnel(
        yield* openFunnelPage(session),
        characterName,
      );
      const onFilm = yield* chooseFunnelCharacter(
        onSearch,
        characterName,
      );
      return yield* chooseFunnelFilm(onFilm, filmTitle);
    }),
  );

export const givenChoseTransport =
  Bdd.given`I chose the transport "${transportName}" for the character "${characterName}" and film "${filmTitle}"`(
    Effect.fn("givenChoseTransport")(function*(
      {
        transportName,
        characterName,
        filmTitle,
      }: {
        readonly transportName: string;
        readonly characterName: string;
        readonly filmTitle: string;
      },
      session: Session,
    ) {
      const onSearch = yield* searchFunnel(
        yield* openFunnelPage(session),
        characterName,
      );
      const onFilm = yield* chooseFunnelCharacter(
        onSearch,
        characterName,
      );
      const onTransport = yield* chooseFunnelFilm(onFilm, filmTitle);
      return yield* chooseFunnelTransport(onTransport, transportName);
    }),
  );

export const givenCharacterChoiceFailed =
  Bdd.given`the character choice failed`(
    Effect.fn("givenCharacterChoiceFailed")(function*(
      session: Session,
    ) {
      return yield* chooseFunnelCharacterWithId(session, "999");
    }),
  );

export const openPath = Bdd.when`I open the path "${path}"`(
  Effect.fn("openPath")(function*(
    { path }: { readonly path: string },
    session: Session,
  ) {
    const app = yield* ScenarioApp;
    yield* session.page.goto(`${app.url}${path}`, { waitUntil: "load" });
    yield* interactionPause;
    return session;
  }),
);

export const openHome = Bdd.when`I open the home`(
  Effect.fn("openHome")(function*(session: Session) {
    const app = yield* ScenarioApp;
    yield* session.page.goto(
      `${app.url}${localeHref(session.locale, `/${session.universe}`)}`,
      { waitUntil: "load" },
    );
    yield* interactionPause;
    return session;
  }),
);

export const openFunnel = Bdd.when`I open the funnel`(
  Effect.fn("openFunnel")(function*(session: Session) {
    return yield* openFunnelPage(session);
  }),
);

export const openFunnelFromHome =
  Bdd.when`I open the funnel from the home`(
    Effect.fn("openFunnelFromHome")(function*(session: Session) {
      yield* session.page
        .locator('main a[href$="/funnel"]')
        .nth(0)
        .click();
      yield* interactionPause;
      return session;
    }),
  );

export const openBrand = Bdd.when`I open the brand`(
  Effect.fn("openBrand")(function*(session: Session) {
    yield* session.page.locator("header a").nth(0).click();
    yield* interactionPause;
    return session;
  }),
);

export const chooseLanguage = Bdd.when`I choose the language ${locale}`(
  Effect.fn("chooseLanguage")(function*(
    { locale }: { readonly locale: Locale },
    session: Session,
  ) {
    yield* session.page
      .getByRole("link", { name: LocaleLabels[locale] })
      .click();
    yield* interactionPause;
    return { ...session, locale };
  }),
);

export const chooseUniverseNamed =
  Bdd.when`I choose the universe ${targetUniverse}`(
    Effect.fn("chooseUniverseNamed")(function*(
      { targetUniverse }: { readonly targetUniverse: Universe },
      session: Session,
    ) {
      yield* session.page
        .getByRole("link", { name: universeLabel(targetUniverse) })
        .click();
      yield* interactionPause;
      return { ...session, universe: targetUniverse };
    }),
  );

export const searchFor = Bdd.when`I search for "${query}"`(
  Effect.fn("searchFor")(function*(
    { query }: { readonly query: string },
    session: Session,
  ) {
    return yield* searchFunnel(session, query);
  }),
);

export const searchWithoutQuery =
  Bdd.when`I search without a query`(
    Effect.fn("searchWithoutQuery")(function*(session: Session) {
      return yield* searchFunnel(session, "");
    }),
  );

export const chooseCharacter =
  Bdd.when`I choose the character "${characterName}"`(
    Effect.fn("chooseCharacter")(function*(
      { characterName }: { readonly characterName: string },
      session: Session,
    ) {
      return yield* chooseFunnelCharacter(session, characterName);
    }),
  );

export const chooseFilm = Bdd.when`I choose the film "${filmTitle}"`(
  Effect.fn("chooseFilm")(function*(
    { filmTitle }: { readonly filmTitle: string },
    session: Session,
  ) {
    return yield* chooseFunnelFilm(session, filmTitle);
  }),
);

export const chooseTransport =
  Bdd.when`I choose the transport "${transportName}"`(
    Effect.fn("chooseTransport")(function*(
      { transportName }: { readonly transportName: string },
      session: Session,
    ) {
      return yield* chooseFunnelTransport(session, transportName);
    }),
  );

export const chooseCharacterWithId =
  Bdd.when`I choose the character with id "${characterId}"`(
    Effect.fn("chooseCharacterWithId")(function*(
      { characterId }: { readonly characterId: string },
      session: Session,
    ) {
      return yield* chooseFunnelCharacterWithId(session, characterId);
    }),
  );

export const chooseFilmWithOrder =
  Bdd.when`I choose the film with order "${filmOrder}"`(
    Effect.fn("chooseFilmWithOrder")(function*(
      { filmOrder }: { readonly filmOrder: string },
      session: Session,
    ) {
      return yield* chooseFunnelFilmWithOrder(session, filmOrder);
    }),
  );

export const chooseTransportWithKey =
  Bdd.when`I choose the transport with key "${transportKey}"`(
    Effect.fn("chooseTransportWithKey")(function*(
      { transportKey }: { readonly transportKey: string },
      session: Session,
    ) {
      return yield* chooseFunnelTransportWithKey(
        session,
        transportKey,
      );
    }),
  );

export const openDossier = Bdd.when`I open the dossier`(
  Effect.fn("openDossier")(function*(session: Session) {
    yield* session.page.locator('main a[href^="results?"]').click();
    yield* interactionPause;
    return session;
  }),
);

export const startOver = Bdd.when`I start over`(
  Effect.fn("startOver")(function*(session: Session) {
    yield* session.page.locator('main a[href="funnel"]').click();
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
      const params = new URLSearchParams();
      if (characterId !== "missing") params.set("character", characterId);
      if (filmOrder !== "missing") params.set("film", filmOrder);
      if (transportKey !== "missing") params.set("transport", transportKey);
      const query = params.toString();
      yield* session.page.goto(
        `${app.url}${
          localeHref(
            session.locale,
            `/${session.universe}/results${query === "" ? "" : `?${query}`}`,
          )
        }`,
        { waitUntil: "load" },
      );
      yield* interactionPause;
      return session;
    }),
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

export const seeContaining = Bdd.then`I see text containing "${text}"`(
  Effect.fn("seeContaining")(function*(
    { text }: { readonly text: string },
    session: Session,
  ) {
    yield* session.page
      .getByText(text, { exact: false })
      .nth(0)
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

export const theAddressIs = Bdd.then`the address is "${address}"`(
  Effect.fn("theAddressIs")(function*(
    { address }: { readonly address: string },
    session: Session,
  ) {
    const app = yield* ScenarioApp;
    yield* session.page.pipe(Expect.toHaveURL(`${app.url}${address}`));
    return session;
  }),
);

export const theLinkPointsTo =
  Bdd.then`the link "${linkLabel}" points to "${linkHref}"`(
    Effect.fn("theLinkPointsTo")(function*(
      {
        linkLabel,
        linkHref,
      }: {
        readonly linkLabel: string;
        readonly linkHref: string;
      },
      session: Session,
    ) {
      yield* session.page
        .getByRole("link", { name: linkLabel })
        .pipe(Expect.toHaveAttribute("href", linkHref));
      return session;
    }),
  );

export const theDocumentLanguageIs =
  Bdd.then`the document language is ${locale}`(
    Effect.fn("theDocumentLanguageIs")(function*(
      { locale }: { readonly locale: Locale },
      session: Session,
    ) {
      yield* session.page
        .locator("html")
        .pipe(Expect.toHaveAttribute("lang", locale));
      return session;
    }),
  );

export const environment = (feature: string, scenario: string) =>
  Layer.merge(
    scenarioApp,
    scenarioPage({ feature, index: 0, scenario }),
  );
