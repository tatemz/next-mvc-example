import { Schema } from "effect";
import { CharacterId } from "../domain/FilmUniverse.model";

export const FunnelSearchForm = Schema.Struct({
  query: Schema.Trimmed.check(Schema.isNonEmpty()),
});
export type FunnelSearchForm = typeof FunnelSearchForm.Type;

export const FunnelChooseForm = Schema.Struct({
  characterId: CharacterId,
});
export type FunnelChooseForm = typeof FunnelChooseForm.Type;

export const FunnelFilmForm = Schema.Struct({
  order: Schema.NumberFromString.check(Schema.isInt()),
});
export type FunnelFilmForm = typeof FunnelFilmForm.Type;

export const FunnelTransportForm = Schema.Struct({
  transportKey: Schema.String,
});
export type FunnelTransportForm = typeof FunnelTransportForm.Type;
