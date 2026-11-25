import { HomeHeroImageViewModel } from "../../components/HomePage";

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
