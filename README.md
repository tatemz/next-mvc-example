# next-mvc-example

A small Next.js App Router example with Effect v4, styled with Tailwind 4 and
daisyUI. One character-dossier experience is served from two film universes:
Star Wars through SWAPI, and Studio Ghibli through the Ghibli API. The
controllers, view models, and components are shared; only the runtime and server
action injected at the route change.

| Star Wars (`/star-wars`) | Studio Ghibli (`/ghibli`) |
| --- | --- |
| ![Star Wars dossier](docs/star-wars.jpg) | ![Ghibli dossier](docs/ghibli.jpg) |

Run `pnpm install && pnpm dev`, then open `/star-wars` or `/ghibli`.

## Routes

| Experience | Home | Funnel | Results |
| --- | --- | --- | --- |
| Star Wars | `/star-wars` | `/star-wars/funnel` | `/star-wars/results` |
| Studio Ghibli | `/ghibli` | `/ghibli/funnel` | `/ghibli/results` |

The root redirects to `/star-wars`. The header switches between the two
experiences; each home's CTA enters its own funnel.

## What it shows

- Every model is a `Schema.TaggedStruct` or `Schema.TaggedUnion`, and nested
  models carry their own `_tag`.
- `CharacterId` is a branded string built from `Schema.NumberFromString`, so
  `Person.id` and `PeopleCatalog.getPerson` accept only a validated character
  id.
- Every user-visible string, including labels and button copy, is carried by the
  view model rather than written in a view.
- View models and their factories do not import domain models. The controllers
  are the only place that map adapter records into view models.
- `HomePageViewModel` is a `Schema.TaggedUnion` of `Loaded` and `Failed`.
- `PeopleCatalog` is the port: `getPerson` and `searchPeople`, with
  `PeopleCatalogError`. It has two implementations:
  - `SwapiPeopleCatalog` maps SWAPI people, films, planets, species, starships,
    and vehicles into the domain.
  - `GhibliPeopleCatalog` maps Ghibli people, films, and species into the same
    domain. The array index is the character id; missing measurements are
    `unknown`; transports are empty.
- `makeHomePage(runtime, searchAction)` is the dependency-injection seam. The
  same `loadHomePage` controller and `ConnectedHomePage` render against any
  `PeopleCatalog` runtime and matching server action. The `StarWarsHome.page.tsx`
  and `GhibliHome.page.tsx` page modules inject `swapiRuntime` + `searchPerson`
  or `ghibliRuntime` + `searchGhibliPerson`; the routes re-export those modules.
- `FilmUniverse.model.ts` uses universe-neutral terms: `Person`, `Film` with an
  `order`, `Origin`, `Species`, `Transport`. A film is a film in either
  universe; its order is an episode number or a list position.
- `Film.imageUrl` is optional. The Ghibli adapter fills it from the film
  API's `image` field; SWAPI has no image field, so Star Wars leaves it empty.
  The shared film list, funnel choices, review, and results render the poster
  only when it exists.
- `makeNextPage` is the Next boundary adapter. It awaits `searchParams`, takes
  the first value of repeated query keys, and decodes the result with a schema.
  The page module receives `Option<Params>`; an invalid query renders its
  `Missing` state, while the controller receives already-typed params. Route
  files only re-export page modules.
- `FunnelViewModel` is a `Schema.TaggedUnion` of `Search`, `Choose`, `Film`,
  `Transport`, `Review`, and `Failed`. `Funnel.controller.ts` advances it with an
  exhaustive Effect `Match` over the current step. Its controller also depends
  only on `PeopleCatalog`.
- `makeFunnelPage(runtime, submitAction)` and `makeResultsPage(runtime,
  basePath)` are the same seam for the other two features. `/star-wars/funnel`
  and `/ghibli/funnel` run the same funnel controller and view models with their
  own runtime and action. The review's relative `results?` link stays inside the
  dataset, and the results page's home/start-over links use the dataset base.
- The results page module declares `ResultsParams`; the `makeNextPage` adapter
  parses `/results?character=&film=&transport=`, and `loadResults` receives
  typed params before rebuilding the dossier from the same catalog.
- `searchPerson`, `searchGhibliPerson`, and `submitFunnel` are server actions.
- `HomePage.connected.tsx` and `Funnel.connected.tsx` are the two client
  components. Both use `useActionState`; the home page receives its action as a
  prop.
- `features/` drives the built app with Strider through effect-bdd. Scenarios run
  in parallel, each on its own OS-assigned port. Debug mode records one paced
  WebM per feature; a failed scenario also writes a full-page screenshot.

Each component is one file, ordered model, optics (when needed), factory, dumb
view, connected view; its tests sit beside it. HomePage and Funnel keep their
connected views in their `.connected.tsx` modules, the two `"use client"`
boundaries.

## Layout

```text
app/layout.tsx                               html/body wrapper; loads AppShell
app/page.tsx                                 redirects / to /star-wars
app/star-wars/page.tsx                       re-exports StarWarsHome.page
app/star-wars/funnel/page.tsx                re-exports StarWarsFunnel.page
app/star-wars/results/page.tsx               re-exports StarWarsResults.page
app/ghibli/page.tsx                          re-exports GhibliHome.page
app/ghibli/funnel/page.tsx                   re-exports GhibliFunnel.page
app/ghibli/results/page.tsx                  re-exports GhibliResults.page
src/page-modules/HomePage/HomePage.factory.tsx    runtime + action + funnel href -> home page
src/page-modules/HomePage/StarWarsHome.page.tsx   SWAPI runtime + action
src/page-modules/HomePage/GhibliHome.page.tsx     Ghibli runtime + action
src/page-modules/Funnel/Funnel.factory.tsx        runtime + action -> funnel page
src/page-modules/Funnel/StarWarsFunnel.page.tsx   SWAPI runtime + submitFunnel
src/page-modules/Funnel/GhibliFunnel.page.tsx     Ghibli runtime + submitGhibliFunnel
src/page-modules/Results/Results.factory.tsx      runtime + dataset base -> results page
src/page-modules/Results/StarWarsResults.page.tsx SWAPI runtime + /star-wars
src/page-modules/Results/GhibliResults.page.tsx   Ghibli runtime + /ghibli
src/platform/NextPage.ts                     Next searchParams -> typed page params
src/components/AppShell/                     AppShell.tsx
src/components/HomePage/                     HomePage.tsx, HomePage.connected.tsx
src/components/Funnel/                       Funnel.tsx, Funnel.connected.tsx
src/components/Results/                      Results.tsx
src/components/PersonCard/                   PersonCard.tsx
src/components/FilmList/                     FilmList.tsx
src/components/FilmListItem/                 FilmListItem.tsx
src/components/SearchForm/                   SearchForm.tsx
src/controllers/AppShell.controller.ts      I18n -> shell view model
src/controllers/HomePage.controller.ts       Config + PeopleCatalog -> home view model
src/controllers/SearchPerson.controller.ts   form schema + catalog -> home view model
src/controllers/Funnel.controller.ts         Match state machine for the funnel
src/controllers/Results.controller.ts        typed params + catalog -> dossier
src/actions/SearchPerson.serverAction.ts     SWAPI home "use server" boundary
src/actions/GhibliSearchPerson.serverAction.ts  Ghibli home "use server" boundary
src/actions/Funnel.serverAction.ts           SWAPI funnel "use server" boundary
src/actions/GhibliFunnel.serverAction.ts     Ghibli funnel "use server" boundary
src/domain/FilmUniverse.model.ts             CharacterId, Person, Film, Origin,
                                             Species, Transport
src/server/Runtime.ts                        shellRuntime, swapiRuntime, ghibliRuntime
src/services/PeopleCatalog.ts                port and error
src/services/SwapiApi.ts                     typed SWAPI endpoints
src/services/SwapiPeopleCatalog.factory.ts   SWAPI records -> domain
src/services/SwapiPeopleCatalog.layer.ts     SWAPI Config + HttpClient layer
src/services/GhibliApi.ts                    typed Ghibli endpoints
src/services/GhibliPeopleCatalog.factory.ts  Ghibli records -> domain
src/services/GhibliPeopleCatalog.layer.ts    Ghibli Config + HttpClient layer
features/CharacterLookup.feature             Star Wars home lookup scenarios
features/Funnel.feature                      Star Wars dossier funnel scenarios
features/GhibliFunnel.feature                Ghibli dossier funnel through the same page
features/Datasets.feature                    the Ghibli home through the same page
features/SharedSteps.ts                      shared browser steps
features/support/ScenarioApp.ts              boots the built Next app per scenario
                                             on an OS-assigned port
features/support/ScenarioPage.ts             page, video, failure screenshot
features/support/Video.ts                    ordered clips -> one WebM per feature
features/support/Debug.ts                    E2E_DEBUG flag and interaction pause
```

`src/pages` is reserved by Next's Pages Router, so page modules use the
`src/page-modules` name. A page module is only the page wrapper;
controllers, actions, domain, services, and the server runtime stay in their own
layers.

## Commands

```sh
pnpm install
pnpm dev
pnpm test
pnpm test:coverage
pnpm typecheck
pnpm build
pnpm start
pnpm test:e2e
pnpm test:e2e:debug
```

Open `/star-wars` or `/ghibli` to compare the two datasets. The root redirects
to `/star-wars`.

## Requirements

- Node.js 22.12+
- pnpm 10
- Chrome or Chromium for `pnpm test:e2e`, plus ffmpeg for `pnpm test:e2e:debug`

## Integration tests

`pnpm test:e2e` builds the app, then runs the Gherkin scenarios with
`effect-bdd`. Four features cover the Star Wars home and funnel and the Ghibli
home and funnel through the same page modules. Scenarios run in parallel; each
starts its own `next start -p 0`, so the OS assigns a free port, opens a Chromium
page with Strider, and closes both when the scenario ends. It records nothing and
pauses nowhere.

`pnpm test:e2e:debug` runs the same scenarios one at a time, pauses a second
after each browser interaction, and records the whole feature into one
`artifacts/<feature>.webm`. Debug mode needs ffmpeg; the default run does not.

Both need Chrome or Chromium:

```sh
CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  pnpm test:e2e
```

The scenarios use the live SWAPI and Ghibli APIs, so they need a network
connection. A failure writes `artifacts/<scenario>.png`. The folder is ignored
by git.

Copy `.env.example` to `.env.local` to choose the starting character or point
either adapter at another host. The defaults are `CHARACTER_ID=1`,
`STAR_WARS_API_URL=https://swapi.dev/api`, and
`GHIBLI_API_URL=https://ghibliapi.vercel.app`.
