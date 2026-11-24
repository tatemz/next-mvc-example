import { Schema } from "effect";
import { FooBarListItemModel } from "../FooBarListItem/model";

export type FooBarListModel = typeof FooBarListModel.Type;
export const FooBarListModel = Schema.TaggedStruct("FooBarListModel", {
  items: Schema.NonEmptyArray(FooBarListItemModel),
});
