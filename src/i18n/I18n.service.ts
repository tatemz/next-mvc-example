import { Array, Context, Layer } from "effect";
import * as PlatformI18n from "./I18n";
import { type Locale, Locales } from "./Locale";
import { MESSAGES } from "./messages";
import { MESSAGES_ES_MX } from "./messages.es-MX";

export type I18n = PlatformI18n.I18n<
  PlatformI18n.MessageDescriptors<typeof MESSAGES>
>;

export const makeI18n = (locale: Locale): I18n =>
  locale === Locales.EsMX
    ? PlatformI18n.make({ messages: MESSAGES_ES_MX, locale })
    : PlatformI18n.make({ messages: MESSAGES, locale });

export const makeEn = () => makeI18n(Locales.EnUS);

export const makeEs = () => makeI18n(Locales.EsMX);

export class I18nCatalog extends Context.Service<
  I18nCatalog,
  Record<Locale, I18n>
>()("next-mvc-example/I18nCatalog") {}

export const makeI18nCatalog = (): Record<Locale, I18n> => ({
  [Locales.EnUS]: makeI18n(Locales.EnUS),
  [Locales.EsMX]: makeI18n(Locales.EsMX),
});

export const layer = Layer.sync(I18nCatalog, makeI18nCatalog);

export const layerTest = Layer.sync(I18nCatalog, () => {
  const testI18n = (locale: Locale): I18n => {
    const _: I18n["_"] = (descriptor) => JSON.stringify(descriptor);
    const all: I18n["all"] = Array.reduce(
      {} as { [K in keyof typeof MESSAGES]: string },
      (acc, descriptor) => ({
        ...acc,
        [descriptor.id]: _(descriptor),
      }),
    );
    return { locale, _, all };
  };

  return {
    [Locales.EnUS]: testI18n(Locales.EnUS),
    [Locales.EsMX]: testI18n(Locales.EsMX),
  };
});
