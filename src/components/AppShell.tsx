import { Array, Function, Match, Schema } from "effect";
import type { ReactNode } from "react";
import { Universe, Universes } from "../domain/FilmUniverse.model";
import type { I18n } from "../i18n/I18n.service";
import {
  LocaleLabels,
  Locales,
  localeHref,
} from "../i18n/Locale";
import { LocaleSchema } from "../i18n/Locale.schema";

export const ExperienceThemes = {
  Night: "night",
  Autumn: "autumn",
} as const;

export const ExperienceTheme = Schema.Literals([
  ExperienceThemes.Night,
  ExperienceThemes.Autumn,
]);
export type ExperienceTheme = typeof ExperienceTheme.Type;

const AppShellLinkViewModel = Schema.TaggedStruct(
  "AppShellLinkViewModel",
  {
    label: Schema.NonEmptyString,
    href: Schema.NonEmptyString,
  },
);
type AppShellLinkViewModel = typeof AppShellLinkViewModel.Type;

export const AppShellViewModel = Schema.TaggedStruct("AppShellViewModel", {
  locale: LocaleSchema,
  universe: Universe,
  theme: ExperienceTheme,
  brand: AppShellLinkViewModel,
  localeSwitch: AppShellLinkViewModel,
  links: Schema.Array(AppShellLinkViewModel),
});
export type AppShellViewModel = typeof AppShellViewModel.Type;

export const makeAppShellViewModel = (
  i18n: I18n,
  universe: Universe,
) => {
  const locale = i18n.locale;
  const otherLocale =
    locale === Locales.EsMX ? Locales.EnUS : Locales.EsMX;

  return AppShellViewModel.make({
    locale,
    universe,
    theme: Match.value(universe).pipe(
      Match.when(Universes.StarWars, () => ExperienceThemes.Night),
      Match.when(Universes.Ghibli, () => ExperienceThemes.Autumn),
      Match.exhaustive,
    ),
    brand: AppShellLinkViewModel.make({
      label: i18n._({ id: "shell.brand" }),
      href: localeHref(locale, "/"),
    }),
    localeSwitch: AppShellLinkViewModel.make({
      label: LocaleLabels[otherLocale],
      href: localeHref(otherLocale, `/${universe}`),
    }),
    links: [
      AppShellLinkViewModel.make({
        label: i18n._({ id: "shell.starWars" }),
        href: localeHref(locale, `/${Universes.StarWars}`),
      }),
      AppShellLinkViewModel.make({
        label: i18n._({ id: "shell.ghibli" }),
        href: localeHref(locale, `/${Universes.Ghibli}`),
      }),
    ],
  });
};

export type AppShellProps = AppShellViewModel & {
  readonly children: ReactNode;
};

export const AppShell = ({ children, ...model }: AppShellProps) => (
  <div
    data-theme={model.theme}
    className="min-h-screen bg-base-200 text-base-content"
  >
    <header className="navbar bg-base-300 px-4 shadow-sm">
      <div className="flex-1">
        <a href={model.brand.href} className="btn btn-ghost text-xl">
          {model.brand.label}
        </a>
      </div>
      <div className="flex-none flex gap-2">
        <a href={model.localeSwitch.href} className="btn btn-ghost">
          {model.localeSwitch.label}
        </a>
        {Function.pipe(
          model.links,
          Array.map((link) => (
            <a key={link.href} href={link.href} className="btn btn-ghost">
              {link.label}
            </a>
          )),
        )}
      </div>
    </header>
    <main className="mx-auto w-full max-w-5xl p-4">{children}</main>
  </div>
);
