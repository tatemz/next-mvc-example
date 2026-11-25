import { Option, Schema, type Effect } from "effect";
import type { ReactNode } from "react";

export type NextSearchParams = Readonly<
  Record<string, string | ReadonlyArray<string> | undefined>
>;

export type NextPageProps = {
  readonly searchParams: Promise<NextSearchParams>;
};

type Runtime<R> = {
  readonly runPromise: <A, E>(effect: Effect.Effect<A, E, R>) => Promise<A>;
};

export type NextPageConfig<Params, Model, R> = {
  readonly runtime: Runtime<R>;
  readonly searchParams: Schema.ConstraintDecoder<Params>;
  readonly load: (
    params: Option.Option<Params>,
  ) => Effect.Effect<Model, never, R>;
  readonly view: (model: Model) => ReactNode;
};

const firstValue = (value: string | ReadonlyArray<string> | undefined) =>
  typeof value === "string" ? value : value?.[0];

const normalizeSearchParams = (params: NextSearchParams) =>
  Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, firstValue(value)]),
  );

export const makeNextPage = <Params, Model, R>(
  config: NextPageConfig<Params, Model, R>,
) =>
  async function NextPage({ searchParams }: NextPageProps) {
    const raw = await searchParams;
    const params = Schema.decodeUnknownOption(config.searchParams)(
      normalizeSearchParams(raw),
    );
    const model = await config.runtime.runPromise(config.load(params));
    return config.view(model);
  };
