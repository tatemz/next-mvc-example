import { Schema } from "effect";
import {
  HttpApi,
  HttpApiClient,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/http-api";

export const GhibliPersonResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  gender: Schema.String,
  films: Schema.Array(Schema.String),
  species: Schema.String,
});
export type GhibliPersonResponse = typeof GhibliPersonResponse.Type;

export const GhibliFilmResponse = Schema.Struct({
  title: Schema.NonEmptyString,
  image: Schema.optional(Schema.String),
  url: Schema.String,
});
export type GhibliFilmResponse = typeof GhibliFilmResponse.Type;

export const GhibliSpeciesResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  url: Schema.String,
});
export type GhibliSpeciesResponse = typeof GhibliSpeciesResponse.Type;

export class GhibliPeopleApi extends HttpApiGroup.make("people").add(
  HttpApiEndpoint.get("list", "/people", {
    success: Schema.Array(GhibliPersonResponse),
  }),
) {}

export class GhibliFilmsApi extends HttpApiGroup.make("films").add(
  HttpApiEndpoint.get("list", "/films", {
    success: Schema.Array(GhibliFilmResponse),
  }),
) {}

export class GhibliSpeciesApi extends HttpApiGroup.make("species").add(
  HttpApiEndpoint.get("list", "/species", {
    success: Schema.Array(GhibliSpeciesResponse),
  }),
) {}

export class GhibliApi extends HttpApi.make("GhibliApi")
  .add(GhibliPeopleApi)
  .add(GhibliFilmsApi)
  .add(GhibliSpeciesApi) {}

export type GhibliApiClient = HttpApiClient.ForApi<typeof GhibliApi>;
