import { Effect } from "effect";
import { localeHref } from "../i18n/Locale";
import {
  NextRedirect,
  RedirectTypes,
} from "../platform/NextRedirect";
import { tag as pathParamsTag } from "../platform/ParsedPathParams";
import { decodeLocale } from "./Universe.controller";

export const loadRootPage = Effect.gen(function*() {
  const params = yield* pathParamsTag;
  return NextRedirect.make({
    url: localeHref(decodeLocale(params), "/star-wars"),
    type: RedirectTypes.Replace,
  });
});
