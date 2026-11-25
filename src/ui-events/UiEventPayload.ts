import { Schema } from "effect";
import { Universe } from "../domain/FilmUniverse.model";
import { Page } from "./UiEvent";

export type UiEventProperty = string | number | boolean;

export const UiEventPayload = Schema.Struct({
  event: Schema.String,
  page: Page,
  universe: Universe,
  occurredAt: Schema.String,
  properties: Schema.Record(
    Schema.String,
    Schema.Union([
      Schema.String,
      Schema.Finite,
      Schema.Boolean,
    ]),
  ),
});
export type UiEventPayload = typeof UiEventPayload.Type;
