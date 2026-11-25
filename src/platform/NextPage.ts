import { Effect } from "effect";
import type { ReactElement } from "react";
import {
  type RenderServices,
  currentRenderContext,
} from "../server/RenderContext";
import {
  type NextRedirect,
  handleNextRedirect,
  isNextRedirect,
} from "./NextRedirect";
import {
  type ParsedSearchParams,
  fromInput,
  tag as parsedSearchParamsTag,
} from "./ParsedSearchParams";

export type NextPageProps = {
  readonly searchParams: Promise<ParsedSearchParams>;
};

const finish = (result: ReactElement | NextRedirect): ReactElement =>
  isNextRedirect(result) ? handleNextRedirect(result) : result;

export const makeNextPage = <E>(
  load: Effect.Effect<
    ReactElement | NextRedirect,
    E,
    ParsedSearchParams | RenderServices
  >,
) =>
  async ({ searchParams }: NextPageProps) => {
    const params = fromInput(await searchParams);
    return finish(
      await Effect.runPromiseWith(currentRenderContext())(
        load.pipe(Effect.provideService(parsedSearchParamsTag, params)),
      ),
    );
  };

export const makeRedirectNextPage = <E>(
  load: Effect.Effect<NextRedirect, E, ParsedSearchParams>,
) =>
  async ({ searchParams }: NextPageProps) => {
    const params = fromInput(await searchParams);
    return finish(
      await Effect.runPromise(
        load.pipe(Effect.provideService(parsedSearchParamsTag, params)),
      ),
    );
  };
