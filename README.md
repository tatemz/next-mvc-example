# next-mvc-example

One character-dossier UI, served from two film universes: Star Wars through
SWAPI and Studio Ghibli through the Ghibli API. Controllers, view models, and
views are shared. Each experience page module supplies its own runtime and
daisyUI theme; the funnel modules also supply their server actions.

| Star Wars (`/star-wars`, night) | Studio Ghibli (`/ghibli`, autumn) |
| --- | --- |
| ![Star Wars dossier](docs/star-wars.jpg) | ![Ghibli dossier](docs/ghibli.jpg) |

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `/star-wars` or `/ghibli`. `pnpm dev` builds the Next app, then serves it
through the Effect HTTP server in `server.ts`.

## Routes

| Experience | Home | Funnel | Results |
| --- | --- | --- | --- |
| Star Wars | `/star-wars` | `/star-wars/funnel` | `/star-wars/results` |
| Studio Ghibli | `/ghibli` | `/ghibli/funnel` | `/ghibli/results` |

The root controller returns a `NextRedirect` to `/star-wars`. The AppShell
header switches between the two experiences.

## Page shape

Each route file re-exports one page module. A page module is the only
composition point: it passes a `ManagedRuntime` and a program to
`makeNextPage`.

```tsx
export const StarWarsFunnelPage = makeNextPage(
  swapiRuntime,
  Effect.map(startFunnel("night"), (model) => (
    <ConnectedFunnelView model={model} submitAction={submitStarWarsFunnel} />
  )),
);
```

- A page program returns a React tree or a `NextRedirect`.
  `handleNextRedirect` is the only module that calls `next/navigation.redirect`.
- `makeNextPage` provides the raw Next `searchParams` as the
  `ParsedSearchParams` service. The page program decodes its own schema with
  `ParsedSearchParams.decodeOption`; the adapter takes no params schema.
- The root page uses the same adapter with a minimal `ManagedRuntime`.
- Page view models carry their own `AppShellViewModel`. The views render the
  shell (brand, links, and theme), so `app/layout.tsx` is only `<html>` and
  `<body>`.
- The AppShell sets `data-theme`: `night` for Star Wars, `autumn` for Ghibli.
  The page views do not know which theme is active.
- Each home page is a splash: a universe image with a visible credit and one
  CTA into that universe's funnel. It loads no character data.
- `server.ts` is the process entrypoint. It serves the Effect `HttpApi` endpoint
  at `/api/ui-events`, and an `HttpRouter` catch-all hands every other request
  to the built Next app. Run `next build` before `pnpm start`; `pnpm dev` does
  the build first.

## What it shows

- Every model is a `Schema.TaggedStruct` or `Schema.TaggedUnion`; nested models
  carry their own `_tag`.
- `CharacterId` is a branded string built from `Schema.NumberFromString`, so
  `Person.id` and `PeopleCatalog.getPerson` accept only a validated id.
- Every user-visible string is carried by the view model; views contain no copy.
- `PeopleCatalog` is the port: `getPerson` and `searchPeople`, with
  `PeopleCatalogError`. Two adapters implement it:
  - `SwapiPeopleCatalog` maps SWAPI people, films, planets, species, starships,
    and vehicles into the domain.
  - `GhibliPeopleCatalog` maps Ghibli people, films, and species. The array index
    is the character id; missing measurements are `unknown`; transports are empty.
- `Film.imageUrl` is optional. The Ghibli adapter fills it from the film API's
  `image` field; SWAPI has no image field. The film list, funnel choices, review,
  and results render the poster only when it exists.
- `FunnelViewModel` is a tagged union of `Search`, `Choose`, `Film`, `Transport`,
  `Review`, and `Failed`. `Funnel.controller.ts` advances it with an exhaustive
  Effect `Match`.
- The results page requires `character`, `film`, and `transport`; a URL missing
  one of them renders the `Missing` state. `transport=none` is an explicit
  choice, not a default.
- The review link is relative (`results?...`); the results page's links use the
  selected universe's base path.
- `submitStarWarsFunnel` and `submitGhibliFunnel` are the server actions.
  `HomeView.connected.tsx`, `FunnelView.connected.tsx`, and
  `ResultsView.connected.tsx` are the client event boundaries.

## UI events

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
carry a review CTA. `makeUiEventHandler` transforms an event
into a flat `UiEventPayload` with `event`, `page`, `universe`, `occurredAt`,
and `properties`, then sends it to every injected `UiEventSink`. The sink
keeps the flat property names (`characterId`, `filmOrder`, `transportKey`,
`query`, and so on).

`AppUiEventProvider` mounts the handler once at the root. The default list has
two sinks: `ConsoleUiEventSink.ts` logs the payload, and
`BeaconUiEventSink.ts` posts it with `navigator.sendBeacon` to
`/api/ui-events`. A failing sink is logged and does not stop the others, so a
new destination is one entry in the list. Connected `HomeView` supplies
page-load and CTA events, `FunnelView` supplies input, validation, and CTA
events, and `ResultsView` supplies page-load and CTA events.

`src/api/UiEventApi.ts` defines `POST /api/ui-events`; `src/api/UiEventApi.layer.ts`
logs each payload through `UiEventLogger`. `server.ts` serves that API and the
Next catch-all from one Effect HTTP server, so the endpoint is not a Next route.
The default layer uses the Effect logger; `UI_EVENT_LOGGER=noop` swaps in a noop
layer, and the integration harness sets it so event traffic does not fill the
test output.

## Storybook

```sh
pnpm storybook
```

The stories in `src/components/*.stories.tsx` render the three top-level page
views, split by universe. Every tagged view-model variant is represented, including pending,
validation-error, known-species, film-poster, transport/no-transport, and both
`night` and `autumn` shells. `.storybook/pageFixtures.ts` builds the models from
the app fixtures and view-model factories.

`pnpm build-storybook` writes a static site to `storybook-static/`.

## Layout

```text
.oxlintrc.json               Effect Oxlint preset and boundary overrides
.storybook/                  Storybook config and page fixtures
server.ts                    Effect HTTP server: UI event API + Next catch-all
app/                         route re-exports; html/body layout
src/api/                     UiEventApi definition and handler layer
src/page-modules/            one Next page per route via makeNextPage
src/platform/                Next adapter, redirect model, parsed params
src/controllers/             page programs, state machines, view models
src/components/              flat view models and views (AppShell included)
src/ui-events/               event model, payload, handler, sinks, and React provider
src/server/                  Effect runtimes and the UI event logger service
src/actions/                 "use server" boundaries
src/domain/                  universe-neutral models
src/services/                PeopleCatalog port and both adapters
features/                    Gherkin plus inline step modules
```

`src/pages` is reserved by the Next Pages Router, so page modules use the
`src/page-modules` name.

## Commands

```sh
pnpm dev
pnpm start
pnpm test
pnpm test:coverage
pnpm typecheck
pnpm build
pnpm check
pnpm lint
pnpm lint:fix
pnpm test:e2e
pnpm test:e2e:debug
pnpm storybook
pnpm build-storybook
```

`pnpm test:e2e` builds the app, then runs `test:e2e:run` with `--parallel=2`.
`pnpm test:e2e:debug` reuses the same runner with `E2E_DEBUG=1 --parallel=1
--verbose`, pausing after each browser interaction and recording one WebM per
feature. The shared command owns the feature/steps globs, reporters, strict
mode, and step timeout. Each run writes `reports/junit.xml` and
`reports/report.html`.

## Integration tests

Four features and 22 scenarios cover both universes:

- Home: the universe splash and its funnel CTA.
- Funnel: review and open a dossier, plus the no-match search.
- Results: complete, missing transport, unknown transport, and explicit no
  transport.
- Navigation: the app root and the header switch.

Each feature is a Scenario Outline with a `universe` column, so adding an API
is a row in the examples tables. The Ghibli rows cover the same home, funnel,
results, and navigation states as Star Wars, including the Ghibli vehicle
transport.

Each scenario starts its own `tsx server.ts` on an OS-assigned port, so the
Effect API and the Next catch-all share one server, and closes it and the
browser when the scenario ends. Shared steps are declared in
`features/support/Steps.ts`, and each feature's `.steps.ts` composes the
scenarios. Scenarios use the live SWAPI and Ghibli APIs, so they need a network
connection. A failure writes a full-page screenshot under `artifacts/`; debug
mode also needs ffmpeg.

```sh
CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  pnpm test:e2e
```

## Checks

```sh
pnpm check
pnpm typecheck
pnpm lint
pnpm lint:fix
```

`typecheck` runs the Effect-patched TypeScript-Go compiler. `lint` runs
type-aware Oxlint with the recommended Effect preset. `check` runs both, and
the `prepare` script patches TypeScript and Oxlint after install. The
`unstable-api-usage` warning is disabled only at the experimental Effect
HTTP/API/server and test/e2e boundaries.

## Requirements

- Node.js 22.12+
- pnpm 10
- Chrome or Chromium for the browser scenarios
- ffmpeg for `pnpm test:e2e:debug`

Copy `.env.example` to `.env.local` to point either adapter at another host.
The example values are `STAR_WARS_API_URL=https://swapi.dev/api` and
`GHIBLI_API_URL=https://ghibliapi.vercel.app`. `server.ts` reads `PORT`
(default `3000`); `UI_EVENT_LOGGER=console` is the default and `noop` drops UI
event logs.
