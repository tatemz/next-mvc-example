import { Match } from "effect";
import { HomePageVariationA } from "../HomePageVariationA/view";
import { HomePageVariationB } from "../HomePageVariationB/view";
import { HomePageModel } from "./model";

export const HomePage = Match.typeTags<HomePageModel>()({
  HomePageVariationAModel: HomePageVariationA,
  HomePageVariationBModel: HomePageVariationB,
});
