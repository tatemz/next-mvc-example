import { Schema } from "effect";
import { Locales } from "./Locale";

export const LocaleSchema = Schema.Literals([
  Locales.EnUS,
  Locales.EsMX,
]);

export type AppLocale = typeof LocaleSchema.Type;
