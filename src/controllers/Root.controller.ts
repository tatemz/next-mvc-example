import { Effect } from "effect";
import {
  NextRedirect,
  RedirectTypes,
} from "../platform/NextRedirect";

export const loadRootPage = Effect.succeed(
  NextRedirect.make({ url: "/star-wars", type: RedirectTypes.Replace }),
);
