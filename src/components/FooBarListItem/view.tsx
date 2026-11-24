import type { FooBarListItemModel } from "./model";

export const FooBarListItem = (model: FooBarListItemModel) => (
  <li>{model.listItemText}</li>
);
