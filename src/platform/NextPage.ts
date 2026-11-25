import { Effect, Schema } from "effect";
import type { ReactElement } from "react";
import {
  type RenderServices,
  currentRenderContext,
} from "../server/RenderContext";
import {
  NextRedirect,
  handleNextRedirect,
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
  Schema.is(NextRedirect)(result)
    ? handleNextRedirect(result)
    : result;

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
