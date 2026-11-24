import { FooBarListItemModel } from "./model";

export const makeFooBarListItemModel = (opts: { n: number }) =>
  FooBarListItemModel.make({
    listItemText: `List item #${opts.n + 1}`,
  });
