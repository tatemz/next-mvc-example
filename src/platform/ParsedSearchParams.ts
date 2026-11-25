import { Array, Context, Effect, Option, Record, Schema } from "effect";

export type ParsedSearchParams = Readonly<
  Record<string, string | ReadonlyArray<string> | undefined>
>;

export const tag = Context.Service<ParsedSearchParams>(
  "@platform/ParsedSearchParams",
);

export const fromInput = (
  params: ParsedSearchParams,
): ParsedSearchParams => params;

const firstValue = (value: string | ReadonlyArray<string> | undefined) =>
  Option.getOrUndefined(
    Option.flatMap(
      Option.fromNullishOr(value),
      (current) => Array.head(Array.ensure(current)),
    ),
  );

const firstValues = (params: ParsedSearchParams) =>
  Record.map(params, firstValue);

export const decodeOption = <A>(
  schema: Schema.ConstraintDecoder<A>,
) =>
  Effect.gen(function*() {
    const params = yield* tag;
    return Schema.decodeUnknownOption(schema)(firstValues(params));
  });
