import { makeHomeViewModel } from "../components/HomeView";
import type { UniverseServices } from "../page-modules/withUniverseServices";

export const loadHome = ({ i18n, universe }: UniverseServices) =>
  makeHomeViewModel(i18n, universe);
