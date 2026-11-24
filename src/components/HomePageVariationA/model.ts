import { Schema } from "effect";

export type HomePageVariationAModel = typeof HomePageVariationAModel.Type;
export const HomePageVariationAModel = Schema.TaggedStruct(
  "HomePageVariationAModel",
  {
    title: Schema.String,
    body: Schema.String,
  },
);
