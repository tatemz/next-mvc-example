import { describe, expect, it } from "vitest";
import {
  DefaultLocale,
  LocaleLabels,
  Locales,
  isLocale,
  localeHref,
} from "./Locale";

describe("localeHref", () => {
  it("leaves the default locale unprefixed", () => {
    expect(localeHref(Locales.EnUS, "/")).toBe("/");
    expect(localeHref(Locales.EnUS, "/star-wars")).toBe("/star-wars");
    expect(localeHref(Locales.EnUS, "/star-wars/funnel")).toBe(
      "/star-wars/funnel",
    );
  });

  it("prefixes a non-default locale", () => {
    expect(localeHref(Locales.EsMX, "/")).toBe("/es-MX");
    expect(localeHref(Locales.EsMX, "/star-wars")).toBe(
      "/es-MX/star-wars",
    );
    expect(localeHref(Locales.EsMX, "/star-wars/funnel")).toBe(
      "/es-MX/star-wars/funnel",
    );
  });
});

describe("isLocale", () => {
  it("accepts the supported locales", () => {
    expect(isLocale(Locales.EnUS)).toBe(true);
    expect(isLocale(Locales.EsMX)).toBe(true);
  });

  it("rejects other values", () => {
    expect(isLocale("fr-FR")).toBe(false);
    expect(isLocale("star-wars")).toBe(false);
  });
});

describe("locale labels", () => {
  it("names each locale in its own language", () => {
    expect(LocaleLabels[Locales.EnUS]).toBe("English");
    expect(LocaleLabels[Locales.EsMX]).toBe("Español");
  });

  it("defaults to US English", () => {
    expect(DefaultLocale).toBe(Locales.EnUS);
  });
});
