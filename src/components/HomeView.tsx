import { Match, Option, Schema } from "effect";
import type { I18n } from "../i18n/I18n.service";
import { Universes, type Universe } from "../domain/FilmUniverse.model";
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
  ghibliSplashImage,
  starWarsSplashImage,
} from "./HomeHero";

export const HomeViewModel = Schema.TaggedStruct("HomeViewModel", {
  shell: AppShellViewModel,
  hero: HomeHeroViewModel,
});
export type HomeViewModel = typeof HomeViewModel.Type;

const copyFor = (i18n: I18n, universe: Universe) =>
  Match.value(universe).pipe(
    Match.when(Universes.StarWars, () => ({
      kicker: i18n._({ id: "shell.starWars" }),
      title: i18n._({ id: "home.starWars.title" }),
      subtitle: i18n._({ id: "home.starWars.subtitle" }),
    })),
    Match.when(Universes.Ghibli, () => ({
      kicker: i18n._({ id: "shell.ghibli" }),
      title: i18n._({ id: "home.ghibli.title" }),
      subtitle: i18n._({ id: "home.ghibli.subtitle" }),
    })),
    Match.exhaustive,
  );

const splashImageFor = Match.type<Universe>().pipe(
  Match.when(Universes.StarWars, () => starWarsSplashImage),
  Match.when(Universes.Ghibli, () => ghibliSplashImage),
  Match.exhaustive,
);

export const makeHomeViewModel = (
  i18n: I18n,
  universe: Universe,
) =>
  HomeViewModel.make({
    shell: makeAppShellViewModel(i18n, universe),
    hero: HomeHeroViewModel.make({
      ...copyFor(i18n, universe),
      funnelLabel: i18n._({ id: "home.hero.funnel" }),
      funnelHref: `/${universe}/funnel`,
      image: splashImageFor(universe),
    }),
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
