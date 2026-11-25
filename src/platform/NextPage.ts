import { Effect, Schema } from "effect";
import type { ReactElement } from "react";
import {
  type RenderServices,
  currentRenderContext,
} from "../server/RenderContext";
import * as NextRedirect from "./NextRedirect";
import * as ParsedSearchParams from "./ParsedSearchParams";

export type NextPageProps = {
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
    ParsedSearchParams.ParsedSearchParams | RenderServices
  >,
) =>
  async ({ searchParams }: NextPageProps) => {
    const params = ParsedSearchParams.fromInput(await searchParams);
    return finish(
      await Effect.runPromiseWith(currentRenderContext())(
        load.pipe(Effect.provideService(ParsedSearchParams.tag, params)),
      ),
    );
  };
