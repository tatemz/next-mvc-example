import { createIntl, type IntlConfig } from "@formatjs/intl";
import type { InferInterpolations } from "@typesafe-intl/core";
import { Record } from "effect";
import type { Locale } from "./Locale";

export type AnyMessages = Record.ReadonlyRecord<string, string>;

type ExtractValues<T extends string> = {} extends InferInterpolations<T>
  ? {}
  : { values: InferInterpolations<T> };

export type MessageDescriptors<Messages extends AnyMessages> = {
  [Id in keyof Messages]: {
    id: Id;
  } & ExtractValues<Messages[Id]>;
};

export interface I18n<
  Descriptors extends Record<string, { readonly id: PropertyKey }>,
> {
  readonly locale: Locale;
  _: <Id extends keyof Descriptors>(descriptor: Descriptors[Id]) => string;
  all: <Id extends keyof Descriptors>(
    descriptors: Descriptors[Id][],
  ) => { [K in Id]: string };
}

const customNumberFormats = {
  "currency:USD": { style: "currency", currency: "USD" },
  "currency:USD:short": {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  twoDecimals: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
} as const;

const customDateFormats = {
  medium: { month: "short", day: "numeric" },
  monthDay: { month: "short", day: "numeric" },
} as const;

export const make = <const Messages extends AnyMessages>(opts: {
  messages: Messages;
  locale: Locale;
  timezone?: string;
}): I18n<MessageDescriptors<Messages>> => {
  const locale = opts.locale;
  const config: IntlConfig<string> = {
    ...opts,
    locale,
    formats: {
      number: customNumberFormats,
      date: customDateFormats,
    },
  };
  const intl = createIntl(config);

  const format = <Id extends keyof MessageDescriptors<Messages>>(
    descriptor: MessageDescriptors<Messages>[Id],
  ) => {
    const { values } = descriptor as any;
    return intl.formatMessage(descriptor as any, { ...values });
  };

  const all = <Id extends keyof MessageDescriptors<Messages>>(
    descriptors: MessageDescriptors<Messages>[Id][],
  ): Record<Id, string> =>
    Record.fromIterableWith(
      (descriptor: (typeof descriptors)[number]) => [
        descriptor.id as string,
        format(descriptor),
      ],
    )(descriptors) as Record<Id, string>;

  return { locale, _: format, all };
};
