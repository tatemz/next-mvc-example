import { Array } from "effect";
import { makeFooBarListItemModel } from "../FooBarListItem/factory";
import { FooBarListModel } from "./model";

export const makeFooBarListModel = (opts: { numberOfItems: number }) =>
  FooBarListModel.make({
    items: Array.makeBy(opts.numberOfItems, (n) =>
      makeFooBarListItemModel({ n }),
    ),
  });
