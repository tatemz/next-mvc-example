import { Array } from "effect";
import { FooBarListItem } from "../FooBarListItem/view";
import type { FooBarListModel } from "./model";

export const FooBarList = (model: FooBarListModel) => (
  <ul>{Array.map(model.items, FooBarListItem)}</ul>
);
