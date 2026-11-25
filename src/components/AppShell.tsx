import { Array, Function, Schema } from "effect";
import type { ReactNode } from "react";
import type { I18n } from "../i18n/I18n.service";

export const ExperienceTheme = Schema.Literals(["night", "autumn"]);
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
  theme: ExperienceTheme,
  brand: AppShellLinkViewModel,
  links: Schema.Array(AppShellLinkViewModel),
});
export type AppShellViewModel = typeof AppShellViewModel.Type;

export const makeAppShellViewModel = (
  i18n: I18n,
  theme: ExperienceTheme,
) =>
  AppShellViewModel.make({
    theme,
    brand: AppShellLinkViewModel.make({
      label: i18n._({ id: "shell.brand" }),
      href: "/",
    }),
    links: [
      AppShellLinkViewModel.make({
        label: i18n._({ id: "shell.starWars" }),
        href: "/star-wars",
      }),
      AppShellLinkViewModel.make({
        label: i18n._({ id: "shell.ghibli" }),
        href: "/ghibli",
      }),
    ],
  });

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
