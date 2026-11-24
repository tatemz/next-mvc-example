import { makeFooBarListModel } from "../FooBarList/factory";
import { HomePageVariationBModel } from "./model";

export const makeHomePageVariationBModel = () =>
  HomePageVariationBModel.make({
    title: "Home Page: Variation B",
    fooBarList: makeFooBarListModel({ numberOfItems: 5 }),
  });
