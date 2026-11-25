import { Context } from "effect";

export type ParsedPathParams = Readonly<Record<string, string>>;

export const tag = Context.Service<ParsedPathParams>(
  "next-mvc-example/ParsedPathParams",
);
