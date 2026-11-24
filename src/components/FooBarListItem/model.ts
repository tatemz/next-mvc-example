import { Schema } from "effect";

export type FooBarListItemModel = typeof FooBarListItemModel.Type;
export const FooBarListItemModel = Schema.TaggedStruct("fooBarListItem", {
  listItemText: Schema.String,
});
