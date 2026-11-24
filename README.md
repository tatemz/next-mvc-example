# next-mvc-example

A small Next.js App Router example with Effect v4. Each component keeps a view
model, a factory, and a view. The page starts with a Star Wars character; the
form posts to a server action and gets the next view model back.

## What it shows

- `HomePageViewModel` is a `Schema.TaggedUnion` of `Loaded` and `Failed`.
- `Loaded.films` is `Schema.NonEmptyArray(FilmViewModel)`.
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

## Layout

```text
app/page.tsx                             runs the controller and renders the model
src/actions/searchPerson.serverAction.ts "use server" boundary
src/components/HomePage/                 model, factory, view, connected view
src/components/PersonCard/               person view model and view
src/components/FilmList/                 non-empty film list model and view
src/components/SearchForm/               form view model and view
src/controllers/homePage.controller.ts   Config + client -> view model
src/controllers/searchPerson.controller.ts form schema + client -> view model
src/domain/Person.ts                     Person and Film domain schemas
src/server/runtime.ts                    one ManagedRuntime for page and action
src/services/StarWarsClient.ts           Context.Service + HttpClient layer
features/character-lookup.feature        the integration scenarios
features/character-lookup.steps.ts       the scenario chains
features/steps.ts                        shared browser steps
features/support/scenario-app.ts         starts the built Next app per scenario
features/support/scenario-page.ts        page, video, failure screenshot
features/support/video.ts                screencast frames -> ffmpeg WebM
```

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
