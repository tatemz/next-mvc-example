import { FooBarList } from "../FooBarList/view";
import type { HomePageVariationBModel } from "./model";

export const HomePageVariationB = (model: HomePageVariationBModel) => (
  <>
    <h2>{model.title}</h2>
    <FooBarList {...model.fooBarList} />
  </>
);
