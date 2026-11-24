import type { HomePageVariationAModel } from "./model";

export const HomePageVariationA = (model: HomePageVariationAModel) => (
  <>
    <h1>{model.title}</h1>
    <p>{model.body}</p>
  </>
);
