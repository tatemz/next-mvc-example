import { Option, Schema } from "effect";
import type { I18n } from "../i18n/I18n.service";
import type { Universe } from "../domain/FilmUniverse.model";
import {
  NotFoundViewModel,
  makeNotFoundViewModel,
} from "./NotFoundView";
import {
  AppShell,
  AppShellViewModel,
  makeAppShellViewModel,
} from "./AppShell";
import {
  HomeHero,
  HomeHeroViewModel,
  makeHomeHeroViewModel,
} from "./HomeHero";

export const HomeViewModel = Schema.TaggedStruct("HomeViewModel", {
  shell: AppShellViewModel,
  hero: HomeHeroViewModel,
});
export type HomeViewModel = typeof HomeViewModel.Type;

export const makeHomeViewModel = (
  i18n: I18n,
  universe: Universe,
) =>
  HomeViewModel.make({
    shell: makeAppShellViewModel(i18n, universe),
    hero: makeHomeHeroViewModel(i18n, universe),
  });

export const HomePageViewModel = Schema.Union([NotFoundViewModel, HomeViewModel]);
export type HomePageViewModel = typeof HomePageViewModel.Type;

export const makeHomePageViewModel = (
  i18n: I18n,
  universe: Option.Option<Universe>,
): HomePageViewModel =>
  Option.match(universe, {
    onNone: () => makeNotFoundViewModel(i18n),
    onSome: (value) => makeHomeViewModel(i18n, value),
  });

export type HomeViewProps = {
  readonly model: HomeViewModel;
  readonly onCtaClick: () => void;
};

export const HomeView = ({ model, onCtaClick }: HomeViewProps) => (
  <AppShell {...model.shell}>
    <HomeHero hero={model.hero} onCtaClick={onCtaClick} />
  </AppShell>
);
