import { Effect, Option, Schema } from "effect";
import { Universe } from "../domain/FilmUniverse.model";
import { tag } from "../platform/ParsedPathParams";

const UniverseParams = Schema.Struct({ universe: Universe });

export const currentUniverse = Effect.gen(function*() {
  const params = yield* tag;
  return Option.map(
    Schema.decodeUnknownOption(UniverseParams)(params),
    (decoded) => decoded.universe,
  );
});
