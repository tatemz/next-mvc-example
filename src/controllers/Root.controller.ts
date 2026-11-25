import { Effect } from "effect";
import { NextRedirect } from "../platform/NextRedirect";

export const loadRootPage = Effect.succeed(
  NextRedirect.make({ url: "/star-wars", type: "replace" }),
);
