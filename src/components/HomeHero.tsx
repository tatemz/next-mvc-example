import { Schema } from "effect";

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

export const starWarsSplashImage = HomeHeroImageViewModel.make({
  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/1280px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
  alt: "The Pillars of Creation, a star-forming region in space",
  credit: "NASA, ESA, and the Hubble Heritage Team (STScI/AURA)",
  creditHref:
    "https://commons.wikimedia.org/wiki/File:Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
});

export const ghibliSplashImage = HomeHeroImageViewModel.make({
  url: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  alt: "Spirited Away film poster",
  credit: "Spirited Away poster © Studio Ghibli, via TMDB",
  creditHref: "https://www.themoviedb.org/movie/129",
});

export const HomeHeroViewModel = Schema.TaggedStruct("HomeHeroViewModel", {
  kicker: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  subtitle: Schema.NonEmptyString,
  funnelLabel: Schema.NonEmptyString,
  funnelHref: Schema.NonEmptyString,
  image: HomeHeroImageViewModel,
});
export type HomeHeroViewModel = typeof HomeHeroViewModel.Type;

export type HomeHeroProps = {
  readonly hero: HomeHeroViewModel;
  readonly onCtaClick: () => void;
};

export const HomeHero = ({ hero, onCtaClick }: HomeHeroProps) => (
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
