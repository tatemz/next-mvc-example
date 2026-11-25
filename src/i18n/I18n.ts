import { createIntl, type IntlConfig } from "@formatjs/intl";
import type { InferInterpolations } from "@typesafe-intl/core";
import { Record } from "effect";
import type { Types } from "effect";

export type AnyMessages = Record.ReadonlyRecord<string, string>;

type ExtractValues<T extends string> = {} extends InferInterpolations<T>
  ? {}
  : { values: InferInterpolations<T> };

type MessageDescriptor<
  Messages extends AnyMessages,
  Id extends keyof Messages,
> = {
  id: Id;
} & ExtractValues<Messages[Id]>;

export interface I18n<Messages extends AnyMessages> {
  _: <Id extends keyof Messages>(
    descriptor: MessageDescriptor<Messages, Id>,
  ) => string;
  all: <Id extends keyof Messages>(
    descriptors: { [P in Id]: MessageDescriptor<Messages, P> }[Id][],
  ) => { [K in Id]: string };
}

export type Locale = FormatjsIntl.IntlConfig extends { locale: infer T }
  ? T extends string
    ? T
    : string
  : string;

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
}): I18n<Messages> => {
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

  const format = <Id extends keyof Messages>(
    descriptor: MessageDescriptor<Messages, Id>,
  ) => {
    const { values } = descriptor as any;
    return intl.formatMessage(descriptor as any, { ...values });
  };

  const all = <Id extends keyof Messages>(
    descriptors: { [P in Id]: MessageDescriptor<Messages, P> }[Id][],
  ): Record<Id, string> =>
    Record.fromIterableWith(
      (descriptor: (typeof descriptors)[number]) => [
        descriptor.id as string,
        format(descriptor),
      ],
    )(descriptors) as Record<Id, string>;

  return { _: format, all };
};
