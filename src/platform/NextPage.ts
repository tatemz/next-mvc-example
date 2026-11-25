import { Effect, type ManagedRuntime } from "effect";
import type { ReactElement } from "react";
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

export const makeNextPage = <R, E>(
  runtime: ManagedRuntime.ManagedRuntime<R, E>,
  load: Effect.Effect<
    ReactElement | NextRedirect,
    never,
    R | ParsedSearchParams
  >,
) =>
  async function NextPage({ searchParams }: NextPageProps) {
    const params = fromInput(await searchParams);
    const result = await runtime.runPromise(
      load.pipe(Effect.provideService(parsedSearchParamsTag, params)),
    );
    return isNextRedirect(result) ? handleNextRedirect(result) : result;
  };
