# next-mvc-example

A small Next.js App Router example with Effect v4, styled with Tailwind 4 and
daisyUI. It has three routes: a home character lookup, a multi-step dossier
funnel, and a results page. Every component keeps a view model, a factory, and a
view; forms post to server actions that return the next view model.

## What it shows

- Every model is a `Schema.TaggedStruct` or `Schema.TaggedUnion`, and nested
  models carry their own `_tag`.
- `CharacterId` is a branded string built from `Schema.NumberFromString`, so
  `Person.id` and `StarWarsClient.getPerson` accept only a validated character
  id.
- Every user-visible string, including labels and button copy, is carried by the
  view model rather than written in a view.
- View models and their factories do not import domain models. The controllers
  are the only place that map SWAPI domain objects into view models.
- `HomePageViewModel` is a `Schema.TaggedUnion` of `Loaded` and `Failed`.
- `StarWarsClient` decodes a person dossier: films, homeworld, species,
  starships, and vehicles. It also searches people by name.
- `FunnelViewModel` is a `Schema.TaggedUnion` of `Search`, `Choose`, `Film`,
  `Transport`, `Review`, and `Failed`. `Funnel.controller.ts` advances it with an
  exhaustive Effect `Match` over the current step.
- The funnel searches SWAPI by name, loads the chosen person, then narrows their
  films and transports before linking to the results page.
- The results page reads `?character=&film=&transport=` through the Next 16
  `searchParams` promise and rebuilds the dossier from SWAPI.
- `searchPerson` and `submitFunnel` are server actions. Each validates the form
  and returns the next view model.
- `HomePage.connected.tsx` and `Funnel.connected.tsx` are the two client
  components. Both use `useActionState`.
- `features/` drives the built app with Strider through effect-bdd. Scenarios run
  in parallel, each on its own OS-assigned port. Debug mode records one paced
  WebM per feature; a failed scenario also writes a full-page screenshot.

Each component is one file, ordered model, optics (when needed), factory, dumb
view, connected view; its tests sit beside it. HomePage and Funnel keep their
connected views in their `.connected.tsx` modules, the two `"use client"`
boundaries.

## Layout

```text
app/page.tsx                                 home route
app/funnel/page.tsx                          funnel route
app/results/page.tsx                         results route; awaits searchParams
src/page-modules/HomePage/HomePage.page.tsx  run controller, render view
src/page-modules/Funnel/Funnel.page.tsx      start the funnel, render it
src/page-modules/Results/Results.page.tsx    load the dossier, render it
src/components/HomePage/                     HomePage.tsx, HomePage.connected.tsx
src/components/Funnel/                       Funnel.tsx, Funnel.connected.tsx
src/components/Results/                      Results.tsx
src/components/PersonCard/                   PersonCard.tsx
src/components/FilmList/                     FilmList.tsx
src/components/FilmListItem/                 FilmListItem.tsx
src/components/SearchForm/                   SearchForm.tsx
src/controllers/HomePage.controller.ts       Config + client -> home view model
src/controllers/SearchPerson.controller.ts   form schema + client -> home view model
src/controllers/Funnel.controller.ts         Match state machine for the funnel
src/controllers/Results.controller.ts        searchParams + client -> dossier
src/actions/SearchPerson.serverAction.ts     "use server" boundary
src/actions/Funnel.serverAction.ts           "use server" boundary
src/domain/StarWars.model.ts                 CharacterId, Person, Film, Planet,
                                             Species, Transport
src/server/Runtime.ts                        one ManagedRuntime for pages and actions
src/services/SwapiApi.ts                     typed SWAPI endpoints
src/services/StarWarsClient.ts               service interface and error
src/services/StarWarsClient.factory.ts       client implementation
src/services/StarWarsClient.layer.ts         Config + HttpClient layer
features/CharacterLookup.feature             home lookup scenarios
features/Funnel.feature                      dossier funnel scenario
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
pnpm typecheck
pnpm build
pnpm start
pnpm test:e2e
pnpm test:e2e:debug
```

## Integration tests

`pnpm test:e2e` builds the app, then runs the Gherkin scenarios with
`effect-bdd`. Two features cover the home lookup and the full dossier funnel.
Scenarios run in parallel; each starts its own `next start -p 0`, so the OS
assigns a free port, opens a Chromium page with Strider, and closes both when
the scenario ends. It records nothing and pauses nowhere.

`pnpm test:e2e:debug` runs the same scenarios one at a time, pauses a second
after each browser interaction, and records the whole feature into one
`artifacts/<feature>.webm`. Debug mode needs ffmpeg; the default run does not.

Both need Chrome or Chromium:

```sh
CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  pnpm test:e2e
```

The scenarios use the live SWAPI, so they need a network connection. A failure
writes `artifacts/<scenario>.png`. The folder is ignored by git.

Copy `.env.example` to `.env.local` to point at another SWAPI host or start with
another character. The defaults are `https://swapi.dev/api` and `1`.
