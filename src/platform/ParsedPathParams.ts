import { Context, Effect, Option, Schema } from "effect";
import { notFound } from "next/navigation";
import { Universe } from "../domain/FilmUniverse.model";

export type ParsedPathParams = Readonly<Record<string, string>>;

export const tag = Context.Service<ParsedPathParams>(
  "next-mvc-example/ParsedPathParams",
);

const UniverseParams = Schema.Struct({ universe: Universe });

export const currentUniverse = Effect.gen(function*() {
  const params = yield* tag;
  const decoded = Schema.decodeUnknownOption(UniverseParams)(params);

  if (Option.isNone(decoded)) {
    notFound();
  }

  return decoded.value.universe;
});
