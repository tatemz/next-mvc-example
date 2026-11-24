import { Schema } from "effect";
import { FooBarListModel } from "../FooBarList/model";

export type HomePageVariationBModel = typeof HomePageVariationBModel.Type;
export const HomePageVariationBModel = Schema.TaggedStruct(
  "HomePageVariationBModel",
  {
    title: Schema.String,
    fooBarList: FooBarListModel,
  },
);
