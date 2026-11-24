# next-mvc-example

A Next.js App Router port of the [mvc-example](https://codesandbox.io/p/sandbox/mvc-example-kdmnzx) CodeSandbox.

Each component keeps the sandbox's roles:

```text
src/components/FooBarList/
  model.ts      Schema.TaggedStruct view model
  factory.ts    builds the model
  view.tsx      renders the model
```

`HomePage` is a union of two variations. `app/page.tsx` owns the controller: it
picks a variation per request and flows the model into `HomePage`.

## Commands

```sh
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm start
```

## Differences from the sandbox

- Views import their model types explicitly so the port typechecks.
- Imports are extensionless throughout.
- `app/page.tsx` sets `dynamic = "force-dynamic"` so the random variation is
  chosen per request instead of being frozen at build time.
- Adds Vitest coverage for the factories and views.
