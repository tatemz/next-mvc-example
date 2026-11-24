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
```

## Commands

```sh
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm start
```

Copy `.env.example` to `.env.local` to point at another SWAPI host or start with
another character. The defaults are `https://swapi.dev/api` and `1`.
