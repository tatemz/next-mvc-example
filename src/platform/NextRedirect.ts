import { Schema } from "effect";
import { redirect as nextRedirect } from "next/navigation";

export const RedirectTypes = {
  Push: "push",
  Replace: "replace",
} as const;

const RedirectType = Schema.Literals([
  RedirectTypes.Push,
  RedirectTypes.Replace,
]);
type RedirectType = typeof RedirectType.Type;

export const NextRedirect = Schema.TaggedStruct("NextRedirect", {
  url: Schema.NonEmptyString,
  type: Schema.optional(RedirectType),
});
export type NextRedirect = typeof NextRedirect.Type;

export const handleNextRedirect = <T>(
  result: T | NextRedirect,
): Exclude<T, NextRedirect> => {
  if (Schema.is(NextRedirect)(result)) {
    throw nextRedirect(result.url, result.type);
  }

  return result as Exclude<T, NextRedirect>;
};
