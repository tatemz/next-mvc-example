import { Array, Context, Layer } from "effect";
import * as PlatformI18n from "./I18n";
import { MESSAGES } from "./messages";

export type I18n = PlatformI18n.I18n<typeof MESSAGES>;

export const I18n = Context.Service<I18n>("next-mvc-example/I18n");

export const makeEn = () =>
  PlatformI18n.make({ messages: MESSAGES, locale: "en-US" });

export const layer = Layer.sync(I18n, makeEn);

export const layerTest = Layer.sync(I18n, () => {
  const _: I18n["_"] = (descriptor) => JSON.stringify(descriptor);
  const all: I18n["all"] = (descriptors) =>
    Array.reduce(
      descriptors,
      {} as { [K in keyof typeof MESSAGES]: string },
      (acc, descriptor) => ({
        ...acc,
        [descriptor.id]: _(descriptor),
      }),
    );
  const rich: I18n["rich"] = (descriptor) => [_(descriptor)];
  return I18n.of({ _, all, rich });
});
