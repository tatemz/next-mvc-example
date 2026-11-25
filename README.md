# next-mvc-example

A character-dossier app built twice, for Star Wars (SWAPI) and Studio Ghibli
(the Ghibli API), from shared controllers, model factories, and views. It runs
on the Next.js App Router behind an Effect HTTP server, and it is a reference
for keeping a production Next app's dependencies explicit and testable.

## Contents

- [Why this project exists](#why-this-project-exists)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting started](#getting-started)
- [Routes](#routes)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [Configuration](#configuration)
- [Checks and CI](#checks-and-ci)

## Why this project exists

Next.js is productive, but much of its behavior is implicit: file-system
routing, server/client boundaries, caching, and module imports with side
effects. That magic is convenient until it hides where data comes from and
what a render touches. Next also has no dependency-injection seam of its own,
so pages and server actions import their clients directly and a test has to
mock modules.

This repo is a small, production-shaped answer for an existing Next app. It
keeps Next and React, makes the implicit boundaries visible, and wires Effect
services with a relatively scalable hack:

- the server entry builds the Effect services once and hands each universe's
  route its catalog;
- the request's Effect `Context` crosses Next's render boundary through
  `AsyncLocalStorage`, because Next's own async machinery does not preserve
  it;
- controllers are Effects. They `yield*` their ports, load and parse, then
  hand domain objects to a pure model factory;
- model factories are synchronous and hold the rendering and business logic;
- views render a view model and nothing else.

The bridge is the only ambient state. Every other dependency arrives through
the request context or a function argument, which is what lets the browser
suite run the same pages with stub catalogs and no network.

A new app that can choose its stack should evaluate
[Foldkit](https://foldkit.dev), a TypeScript framework built on Effect that
makes this architecture the framework's own: one `Model`, explicit `Message`
values, a pure `update` that returns the next model and its `Command`s, and a
runtime that executes them. Foldkit enforces the separation this demo builds
by hand and handles server rendering and hydration itself. The tradeoff is
leaving React and Next, which this project cannot do: it is here to show the
discipline inside an existing Next codebase.

## Features

- Controllers are Effects; every model factory is a pure synchronous function
  over domain values and i18n.
- The universe is a path parameter. One `[universe]` route tree and three page
  modules serve both experiences; the boot composition selects the catalog for
  each path.
- Every model is a `Schema.TaggedStruct` or `Schema.TaggedUnion`; nested models
  carry their own `_tag`.
- `CharacterId` is a branded string built from `Schema.NumberFromString`, so
  `Person.id` and `PeopleCatalog.getPerson` accept only a validated id.
- Every user-visible string is carried by the view model; views contain no
  copy. Messages are typed ICU strings, so the step progress and the plural
  choice subtitle reject the wrong value types at compile time.
- `PeopleCatalog` is the port: `getPerson` and `searchPeople`, with
  `PeopleCatalogError`. Two adapters implement it:
  - `SwapiPeopleCatalog` maps SWAPI people, films, planets, species,
    starships, and vehicles into the domain.
  - `GhibliPeopleCatalog` maps Ghibli people, films, and species. The array
    index is the character id; missing measurements are `unknown`; transports
    are empty.
- `Film.imageUrl` is optional. The Ghibli adapter fills it from the film API's
  `image` field; SWAPI has no image field. The film list, funnel choices,
  review, and results render the poster only when it exists.
- `FunnelViewModel` is a tagged union of `Search`, `Choose`, `Film`,
  `Transport`, `Review`, and `Failed`. `Funnel.controller.ts` advances it with
  an exhaustive Effect `Match`.
- The results page requires `character`, `film`, and `transport`; a URL missing
  one of them renders the `Missing` state. `transport=none` is an explicit
  choice, not a default.
- The review link is relative (`results?...`); the results page's links use the
  selected universe's base path.
- `submitFunnel` is the server action.
  `HomeView.connected.tsx`, `FunnelView.connected.tsx`, and
  `ResultsView.connected.tsx` are the client event boundaries.

## Screenshots

| Star Wars (`/star-wars`, night) | Studio Ghibli (`/ghibli`, autumn) |
| --- | --- |
| ![Star Wars dossier](docs/star-wars.jpg) | ![Ghibli dossier](docs/ghibli.jpg) |

## Getting started

### Requirements

- Node.js 22.12+
- pnpm 10
- Chrome or Chromium for the browser scenarios
- ffmpeg for `pnpm test:e2e:debug`

### Install and run

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

`pnpm dev` builds the Next app and then serves it through the Effect HTTP
server in `server.ts`. Open `/star-wars` or `/ghibli`. `pnpm build` creates the
production build and `pnpm start` serves an existing one. Both scripts load
`.env.local` with Node's `--env-file-if-exists`, so the values reach the
server without exporting them in the shell.

## Routes

| Experience | Home | Funnel | Results |
| --- | --- | --- | --- |
| Star Wars | `/star-wars` | `/star-wars/funnel` | `/star-wars/results` |
| Studio Ghibli | `/ghibli` | `/ghibli/funnel` | `/ghibli/results` |

The root page redirects to `/star-wars`. The AppShell header switches between
the two experiences.

## Architecture

### Page modules and the request context

The `app/[universe]` route segments re-export one page module per view.
`makeNextPage` supplies the parsed search params and the raw path params,
runs the program with the request's Effect context, and renders the result
or hands a `NextRedirect` to Next.

```tsx
export const FunnelPage = Function.pipe(
  startFunnel,
  Effect.map((model) => (
    <ConnectedFunnelView model={model} submitAction={submitFunnel} />
  )),
  makeNextPage,
);
```

- `makeNextPage` provides `ParsedSearchParams` and `ParsedPathParams`.
  Controllers decode their own schemas. `currentUniverse` reads
  `params.universe` and returns an Option; an unknown universe becomes a
  `NotFoundViewModel` that the page renders.
- Subviews with their own view models live in their own files: `HomeHero`,
  the `Funnel*Step` components, and `ResultsReadyView`/`ResultsMissingView`.
- The request context carries `I18n` and one `PeopleCatalog`. `boot/app.ts`
  mounts `/star-wars` with the SWAPI catalog and `/ghibli` with the Ghibli
  one, so a controller never chooses its adapter.
- The root page uses `makeNextPage` with a redirect program.
- Every page view model carries its `AppShellViewModel`, so
  `app/layout.tsx` is only `<html>` and `<body>`. The shell owns the
  `data-theme` value: `night` for Star Wars, `autumn` for Ghibli.
- Each home page is a splash with a credited image and one funnel CTA.
- `server.ts` is the process entrypoint. `boot/live.ts` builds the live
  catalogs, `boot/app.ts` mounts `/api/ui-events` and the Next catch-alls,
  `boot/next.ts` bridges the render context, and `boot/serve.ts` owns the
  socket.

### Controllers and model factories

A controller is an Effect. It loads and parses, then passes domain values to
one top-level model factory. The factory is pure and synchronous, and it owns
the page decision and every derived view model. Types are elided here for
width:

```ts
export const loadResults = (universe, params, shell) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const client = yield* PeopleCatalog;
    const person = yield* Effect.option(client.getPerson(params.character));
    return makeResultsViewModel(
      i18n,
      shell,
      universe,
      person,
      params.film,
      params.transport,
    );
  });
```

`makeResultsViewModel` is the only place that decides between `Ready` and
`Missing` and builds the person, film, and transport view models. The funnel
keeps its in-progress state in `FunnelViewModel` because the server action
serializes that state between steps. Its controller parses the form and loads
the catalog; pure step-result factories decide the next state. The transport
and review factories build from the previous step's model, which is the data
the action actually receives. Form and loaded values stay `Option`s until a
factory or view decides what absence means.

### UI events

UI events are typed, JSON-shaped domain facts emitted from the connected page
components:

- `PageLoaded`
- `CtaClicked`
- `FormValidationError`
- `InputFilled`

`PageLoaded` and `CtaClicked` carry a discriminated page context instead of a
bag of optional fields. The context is `Home`, a funnel stage (`FunnelSearch`,
`FunnelChoose`, `FunnelFilm`, `FunnelTransport`, `FunnelReview`,
`FunnelFailed`), or a results outcome (`ResultsMissing`, `ResultsReady`). Each
variant carries only the facts that state has, so a home page load cannot carry
a film order and a funnel review always has a transport. A transport is
`TransportChosen` with its key or `NoTransport`, never a missing optional key.
`FormValidationError` and `InputFilled` exist only for the funnel search, and
no event payload uses an optional field.

`CtaClicked` is a closed union with one variant per page state: the home CTA,
each funnel stage's CTA, and each results outcome's CTA. A search click cannot
carry a review CTA. `makeUiEventHandler` transforms an event into a flat
`UiEventPayload` with `event`, `page`, `universe`, `occurredAt`, and
`properties`, then sends it to every injected `UiEventSink`. The sink keeps the
flat property names (`characterId`, `filmOrder`, `transportKey`, `query`, and
so on).

`AppUiEventProvider` mounts the handler once at the root. The default list has
two sinks: `ConsoleUiEventSink.ts` logs the payload, and `BeaconUiEventSink.ts`
posts it with `navigator.sendBeacon` to `/api/ui-events`. A failing sink is
logged and does not stop the others, so a new destination is one entry in the
list. Connected `HomeView` supplies page-load and CTA events, `FunnelView`
supplies input, validation, and CTA events, and `ResultsView` supplies
page-load and CTA events.

`src/api/UiEventApi.ts` defines `POST /api/ui-events`; `src/api/UiEventApi.layer.ts`
logs each payload through the Effect logger. `server.ts` serves that API and the
Next catch-all from one Effect HTTP server, so the endpoint is not a Next
route. The API logs through the Effect logger, and the browser suite raises
the minimum log level so event traffic does not fill the test output.

## Project structure

```text
.oxlintrc.json               Effect Oxlint preset and boundary overrides
.storybook/                  Storybook config and page fixtures
server.ts                    process entrypoint: the live app on the configured port
boot/                        app composition, live wiring, socket, and Next bridge
app/                         route re-exports; html/body layout
src/api/                     UiEventApi definition and handler layer
src/page-modules/            one page module per view; shared by both universes
src/platform/                Next adapter, redirect model, parsed search and path params
src/controllers/             page programs and the funnel state machine
src/components/              view models, subviews, and the shared shell
src/ui-events/               event model, payload, handler, sinks, and React provider
src/server/                  Next service, render context, and UI event logger
src/actions/                 "use server" boundaries
src/domain/                  universe-neutral models
src/i18n/                    messages and the i18n service
src/forms/                   form-data helpers
src/services/                PeopleCatalog port and both adapters
features/                    Gherkin, shared steps, and the stubbed scenario app
```

`src/pages` is reserved by the Next Pages Router, so page modules use the
`src/page-modules` name.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Build Next, then serve through `tsx server.ts` |
| `pnpm start` | Serve an existing build through `tsx server.ts` |
| `pnpm build` | Create the production Next build |
| `pnpm test` | Run the Vitest suite |
| `pnpm test:coverage` | Run Vitest with the 100% coverage thresholds |
| `pnpm test:e2e` | Build, then run the 26 browser scenarios |
| `pnpm test:e2e:debug` | Run the browser scenarios slowly and record WebM |
| `pnpm typecheck` | Run the Effect-patched TypeScript compiler |
| `pnpm lint` | Run type-aware Oxlint with the Effect preset |
| `pnpm check` | Run `typecheck` and `lint` |
| `pnpm storybook` | Start Storybook on port 6006 |
| `pnpm build-storybook` | Build the static Storybook site |

`pnpm test:e2e` runs the shared command with `--parallel=2`.
`pnpm test:e2e:debug` reuses it with `E2E_DEBUG=1 --parallel=1 --verbose`,
pausing after each interaction and recording one WebM per feature. The shared
command owns the feature/steps globs, reporters, strict mode, and step timeout.
Each run writes `reports/junit.xml` and `reports/report.html`.

## Testing

### Unit tests and coverage

```sh
pnpm test
pnpm test:coverage
```

Vitest covers schemas, controllers, model factories, views, server actions,
and event handling. `test:coverage` enforces 100% statements, branches,
functions, and lines over `app/` and `src/`.

### Browser suite

`pnpm test:e2e` builds the app and runs 26 Gherkin scenarios with Effect BDD
and Chromium. Four features cover both universes:

- Home: the universe splash and its funnel CTA.
- Funnel: review and open a dossier, the no-match search, and an unavailable
  catalogue.
- Results: complete, missing transport, unknown transport, explicit no
  transport, and an unavailable catalogue.
- Navigation: the app root and the header switch.

Each feature is a Scenario Outline with a `universe` column, so adding an API
is a row in the examples tables. Each scenario boots `boot/app.ts` in-process
on an OS-assigned port, provides the stub catalogs from
`features/support/ScenarioApp.ts`, and closes the app and browser when it
ends. The stubs serve domain fixtures, so the suite needs no network;
`Given the catalogue is unavailable` switches them to the failure path. Shared
steps live in `features/support/Steps.ts`, and each feature's `.steps.ts`
composes the scenarios.

A failure writes a full-page screenshot under `artifacts/`; debug mode records
videos and needs ffmpeg.

```sh
CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  pnpm test:e2e
```

### Storybook

```sh
pnpm storybook
pnpm build-storybook
```

The stories render the three page views for both universes, with every tagged
view-model variant represented, including pending, validation-error,
known-species, film-poster, transport/no-transport, and both shells.
`.storybook/pageFixtures.ts` builds the models from the domain fixtures and
factories. `pnpm build-storybook` writes the static site to `storybook-static/`.

## Configuration

Copy `.env.example` to `.env.local` for local development. The standalone
server loads it automatically.

| Variable | Default | Purpose |
| --- | --- | --- |
| `STAR_WARS_API_URL` | `https://swapi.dev/api` | SWAPI base URL for the live adapter |
| `GHIBLI_API_URL` | `https://ghibliapi.vercel.app` | Ghibli API base URL for the live adapter |
| `PORT` | `3000` | Effect HTTP server port |
| `CHROMIUM_PATH` | none | Chrome or Chromium executable for the browser suite |

The browser suite ignores both API URLs; it provides stub catalogs.

## Checks and CI

```sh
pnpm check
pnpm typecheck
pnpm lint
pnpm lint:fix
```

`typecheck` runs the Effect-patched TypeScript-Go compiler. `lint` runs
type-aware Oxlint with the recommended Effect preset. The `prepare` script
patches TypeScript and Oxlint after install. The `unstable-api-usage` warning
is disabled only at the experimental Effect HTTP/API/server and test/e2e
boundaries in `.oxlintrc.json`.

`.github/workflows/ci.yml` runs four jobs on pushes to `main` and pull
requests:

- lint and typecheck;
- tests with coverage;
- production build;
- browser suite, with Chrome from the runner image.

It uses the Node version in the workflow, pnpm from `packageManager`, and
`pnpm install --frozen-lockfile`. The coverage job uploads its report on
failure, and the browser job always uploads `reports/` plus `artifacts/` on
failure.
