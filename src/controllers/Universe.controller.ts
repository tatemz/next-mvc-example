import { Option, Schema } from "effect";
import { Universe } from "../domain/FilmUniverse.model";
import { DefaultLocale, type Locale } from "../i18n/Locale";
import { LocaleSchema } from "../i18n/Locale.schema";
import type { ParsedPathParams } from "../platform/ParsedPathParams";

export const UniverseParams = Schema.Struct({ universe: Universe });

export const LocaleParams = Schema.Struct({ locale: LocaleSchema });

export const decodeUniverse = (
  params: ParsedPathParams,
): Option.Option<Universe> =>
  Option.map(
    Schema.decodeUnknownOption(UniverseParams)(params),
    (decoded) => decoded.universe,
  );

export const decodeLocale = (params: ParsedPathParams): Locale =>
  Option.match(Schema.decodeUnknownOption(LocaleParams)(params), {
    onNone: () => DefaultLocale,
    onSome: (decoded) => decoded.locale,
  });
