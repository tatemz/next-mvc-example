import { Context, Effect, Schema } from "effect";
import type { ReactElement } from "react";
import {
  type RenderServices,
  currentRenderContext,
} from "../server/RenderContext";
import * as NextRedirect from "./NextRedirect";
import * as ParsedPathParams from "./ParsedPathParams";
import * as ParsedSearchParams from "./ParsedSearchParams";

export type NextPageProps = {
  readonly params?: Promise<Record<string, string>>;
  readonly searchParams: Promise<ParsedSearchParams.ParsedSearchParams>;
};

const finish = (
  result: ReactElement | NextRedirect.NextRedirect,
): ReactElement =>
  Schema.is(NextRedirect.NextRedirect)(result)
    ? NextRedirect.handleNextRedirect(result)
    : result;

export const makeNextPage = <E>(
  load: Effect.Effect<
    ReactElement | NextRedirect.NextRedirect,
    E,
    | ParsedSearchParams.ParsedSearchParams
    | ParsedPathParams.ParsedPathParams
    | RenderServices
  >,
) =>
  async ({ params, searchParams }: NextPageProps) => {
    const search = ParsedSearchParams.fromInput(await searchParams);
    const path = (await params) ?? {};

    const context = Context.add(
      Context.add(
        currentRenderContext(),
        ParsedSearchParams.tag,
        search,
      ),
      ParsedPathParams.tag,
      path,
    );

    return finish(await Effect.runPromiseWith(context)(load));
  };
