import { Schema } from "effect";
import { CharacterId } from "../domain/FilmUniverse.model";

export const FunnelFields = {
  Query: "query",
  CharacterId: "characterId",
  Order: "order",
  TransportKey: "transportKey",
} as const;

export const FunnelSearchForm = Schema.Struct({
  [FunnelFields.Query]: Schema.Trimmed.check(Schema.isNonEmpty()),
});
export type FunnelSearchForm = typeof FunnelSearchForm.Type;

export const FunnelChooseForm = Schema.Struct({
  [FunnelFields.CharacterId]: CharacterId,
});
export type FunnelChooseForm = typeof FunnelChooseForm.Type;

export const FunnelFilmForm = Schema.Struct({
  [FunnelFields.Order]: Schema.NumberFromString.check(Schema.isInt()),
});
export type FunnelFilmForm = typeof FunnelFilmForm.Type;

export const FunnelTransportForm = Schema.Struct({
  [FunnelFields.TransportKey]: Schema.String,
});
export type FunnelTransportForm = typeof FunnelTransportForm.Type;
