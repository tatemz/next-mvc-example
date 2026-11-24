# next-mvc-example

A small Next.js App Router example with Effect v4. Each component keeps a view
model, a factory, and a view. The page starts with a Star Wars character; the
form posts to a server action and gets the next view model back.

## What it shows

- Every model is a `Schema.TaggedStruct` or `Schema.TaggedUnion`, and nested
  models carry their own `_tag`.
- `CharacterId` is a branded string built from `Schema.NumberFromString`, so
  `Person.id` and `StarWarsClient.getPerson` accept only a validated character
  id.
- Every user-visible string, including labels and button copy, is carried by the
  view model rather than written in a view.
- View models and their factories do not import domain models.
  `HomePage.presenter.ts` is the only place that maps `Person` and `Film` into
  the page view model.
- `HomePageViewModel` is a `Schema.TaggedUnion` of `Loaded` and `Failed`.
- `Loaded.filmList.films` is `Schema.NonEmptyArray(FilmViewModel)`.
- `StarWarsClient` is a `Context.Service` layer that decodes SWAPI responses
  into `Person` and `Film` domain objects.
- `makeLoadedHomePageModel` takes the `Person` domain object and builds the view
  model.
- `loadHomePage` reads `STAR_WARS_CHARACTER_ID` with `Config`. Effect's default
  config provider reads `process.env`.
- `searchPerson` is a server action. It validates the form with a schema and
  returns the updated `HomePageViewModel`.
- `HomePage.connected.view.tsx` is the only client component. It uses
  `useActionState` and posts the form to the action.
- `features/` drives the built app with Strider through effect-bdd. Every
  scenario writes a WebM; a failed scenario also writes a full-page screenshot.

Every file is named `Thing.suffix`: `HomePage.model.ts`, `HomePage.factory.ts`,
`HomePage.view.tsx`, `HomePage.connected.view.tsx`, `Person.fixture.ts`.

## Layout

```text
app/page.tsx                             Next route; re-exports HomePage.page
src/page-modules/HomePage/               HomePage.page, .model, .factory,
                                         .presenter, .view, .connected.view,
                                         .controller, .serverAction
src/components/FilmList/                 FilmList.model, .factory, .view
src/components/PersonCard/               PersonCard.model, .factory, .view
src/components/SearchForm/               SearchForm.model, .factory, .view
src/domain/CharacterId.model.ts          branded character id
src/domain/Film.model.ts                 Film domain schema
src/domain/Person.model.ts               Person domain schema
src/server/Runtime.ts                    one ManagedRuntime for page and action
src/services/StarWarsClient.ts           service interface and error
src/services/StarWarsClient.factory.ts   client implementation
src/services/StarWarsClient.layer.ts     Config + HttpClient layer
features/CharacterLookup.feature         the integration scenarios
features/CharacterLookup.steps.ts        the scenario chains
features/SharedSteps.ts                  shared browser steps
features/support/ScenarioApp.ts          starts the built Next app per scenario
features/support/ScenarioPage.ts         page, video, failure screenshot
features/support/Video.ts                screencast frames -> ffmpeg WebM
```

`src/pages` is reserved by Next’s Pages Router, so page modules use the
`src/page-modules` name. Domain, services, and the server runtime stay
in their own layers rather than under `components`.

## Commands

```sh
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm start
pnpm test:e2e
```

## Integration tests

`pnpm test:e2e` builds the app, then runs the Gherkin scenarios with
`effect-bdd`. Each scenario starts its own `next start` on a free port, opens a
Chromium page with Strider, and closes both when the scenario ends.

It needs Chrome or Chromium and ffmpeg:

```sh
CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  pnpm test:e2e
```

The scenarios use the live SWAPI, so they need a network connection. Videos land
in `artifacts/<scenario>.webm`; a failure also writes
`artifacts/<scenario>.png`. The folder is ignored by git.

Copy `.env.example` to `.env.local` to point at another SWAPI host or start with
another character. The defaults are `https://swapi.dev/api` and `1`.
