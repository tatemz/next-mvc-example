import { Schema } from "effect";
import { HomePageVariationAModel } from "../HomePageVariationA/model";
import { HomePageVariationBModel } from "../HomePageVariationB/model";

export type HomePageModel = typeof HomePageModel.Type;
export const HomePageModel = Schema.Union(
  HomePageVariationAModel,
  HomePageVariationBModel,
);
