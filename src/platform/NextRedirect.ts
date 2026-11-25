import { Predicate, Schema } from "effect";
import { redirect as nextRedirect } from "next/navigation";

const RedirectType = Schema.Literals(["push", "replace"]);
type RedirectType = typeof RedirectType.Type;

export const NextRedirect = Schema.TaggedStruct("NextRedirect", {
  url: Schema.NonEmptyString,
  type: Schema.optional(RedirectType),
});
export type NextRedirect = typeof NextRedirect.Type;

export const isNextRedirect = (value: unknown): value is NextRedirect =>
  Predicate.isTagged("NextRedirect")(value);

export const handleNextRedirect = <T>(
  result: T | NextRedirect,
): Exclude<T, NextRedirect> => {
  if (isNextRedirect(result)) {
    throw nextRedirect(result.url, result.type);
  }

  return result as Exclude<T, NextRedirect>;
};
