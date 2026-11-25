import { Option, Schema } from "effect";
import { Universe } from "../domain/FilmUniverse.model";
import type { ParsedPathParams } from "../platform/ParsedPathParams";

export const UniverseParams = Schema.Struct({ universe: Universe });

export const decodeUniverse = (
  params: ParsedPathParams,
): Option.Option<Universe> =>
  Option.map(
    Schema.decodeUnknownOption(UniverseParams)(params),
    (decoded) => decoded.universe,
  );
