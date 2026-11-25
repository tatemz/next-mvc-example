import { Schema } from "effect";
import type { I18n } from "../i18n/I18n.service";
import { AppShell, AppShellViewModel } from "./AppShell";

export const HomeUniverse = Schema.Literals(["star-wars", "ghibli"]);
export type HomeUniverse = typeof HomeUniverse.Type;

export const HomeHeroImageViewModel = Schema.TaggedStruct(
  "HomeHeroImageViewModel",
  {
    url: Schema.NonEmptyString,
    alt: Schema.NonEmptyString,
    credit: Schema.NonEmptyString,
    creditHref: Schema.NonEmptyString,
  },
);
export type HomeHeroImageViewModel = typeof HomeHeroImageViewModel.Type;

const HomeHeroViewModel = Schema.TaggedStruct("HomeHeroViewModel", {
  kicker: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  subtitle: Schema.NonEmptyString,
  funnelLabel: Schema.NonEmptyString,
  funnelHref: Schema.NonEmptyString,
  image: HomeHeroImageViewModel,
});
type HomeHeroViewModel = typeof HomeHeroViewModel.Type;

export const HomePageViewModel = Schema.TaggedStruct("HomePageViewModel", {
  universe: HomeUniverse,
  shell: AppShellViewModel,
  hero: HomeHeroViewModel,
});
export type HomePageViewModel = typeof HomePageViewModel.Type;

const copyFor = (i18n: I18n, universe: HomeUniverse) =>
  universe === "star-wars"
    ? {
        kicker: i18n._({ id: "shell.starWars" }),
        title: i18n._({ id: "homePage.starWars.title" }),
        subtitle: i18n._({ id: "homePage.starWars.subtitle" }),
      }
    : {
        kicker: i18n._({ id: "shell.ghibli" }),
        title: i18n._({ id: "homePage.ghibli.title" }),
        subtitle: i18n._({ id: "homePage.ghibli.subtitle" }),
      };

export const makeHomePageViewModel = (
  i18n: I18n,
  universe: HomeUniverse,
  funnelHref: string,
  shell: AppShellViewModel,
  image: HomeHeroImageViewModel,
) =>
  HomePageViewModel.make({
    universe,
    shell,
    hero: HomeHeroViewModel.make({
      ...copyFor(i18n, universe),
      funnelLabel: i18n._({ id: "homePage.hero.funnel" }),
      funnelHref,
      image,
    }),
  });

export type HomePageProps = HomePageViewModel & {
  readonly onCtaClick: () => void;
};

const HomeHero = ({
  hero,
  onCtaClick,
}: {
  readonly hero: HomeHeroViewModel;
  readonly onCtaClick: () => void;
}) => (
  <section className="hero min-h-[70vh] rounded-box bg-base-100 shadow-xl">
    <div className="hero-content grid w-full max-w-6xl gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="max-w-xl">
        <span className="badge badge-secondary badge-lg mb-4">
          {hero.kicker}
        </span>
        <h1 className="text-4xl font-black sm:text-5xl">{hero.title}</h1>
        <p className="py-5 text-base-content/70">{hero.subtitle}</p>
        <a
          href={hero.funnelHref}
          onClick={onCtaClick}
          className="btn btn-primary btn-lg"
        >
          {hero.funnelLabel}
        </a>
      </div>
      <figure className="w-full">
        <img
          src={hero.image.url}
          alt={hero.image.alt}
          className="h-[420px] w-full rounded-box object-cover shadow-2xl"
        />
        <figcaption className="mt-3 text-xs text-base-content/60">
          <a
            href={hero.image.creditHref}
            target="_blank"
            rel="noreferrer"
            className="link link-hover"
          >
            {hero.image.credit}
          </a>
        </figcaption>
      </figure>
    </div>
  </section>
);

export const HomePage = ({
  onCtaClick,
  ...model
}: HomePageProps) => (
  <AppShell {...model.shell}>
    <HomeHero hero={model.hero} onCtaClick={onCtaClick} />
  </AppShell>
);
