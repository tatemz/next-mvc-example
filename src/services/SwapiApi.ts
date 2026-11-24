import { Schema } from "effect";
import {
  HttpApi,
  HttpApiClient,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/http-api";
import { CharacterId } from "../domain/StarWars.model";

export const PersonResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  birth_year: Schema.String,
  gender: Schema.String,
  homeworld: Schema.String,
  films: Schema.NonEmptyArray(Schema.String),
  species: Schema.Array(Schema.String),
  starships: Schema.Array(Schema.String),
  vehicles: Schema.Array(Schema.String),
  url: Schema.String,
});
export type PersonResponse = typeof PersonResponse.Type;

export const PeopleResponse = Schema.Struct({
  count: Schema.Int,
  results: Schema.Array(PersonResponse),
});
export type PeopleResponse = typeof PeopleResponse.Type;

export const FilmResponse = Schema.Struct({
  title: Schema.NonEmptyString,
  episode_id: Schema.Int,
});
export type FilmResponse = typeof FilmResponse.Type;

export const PlanetResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  climate: Schema.String,
  terrain: Schema.String,
  url: Schema.String,
});
export type PlanetResponse = typeof PlanetResponse.Type;

export const SpeciesResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  classification: Schema.String,
  language: Schema.String,
  url: Schema.String,
});
export type SpeciesResponse = typeof SpeciesResponse.Type;

export const StarshipResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
  url: Schema.String,
});
export type StarshipResponse = typeof StarshipResponse.Type;

export const VehicleResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
  url: Schema.String,
});
export type VehicleResponse = typeof VehicleResponse.Type;

export class SwapiPeopleApi extends HttpApiGroup.make("people")
  .add(
    HttpApiEndpoint.get("get", "/people/:id/", {
      params: { id: CharacterId },
      success: PersonResponse,
    }),
  )
  .add(
    HttpApiEndpoint.get("search", "/people/", {
      query: { search: Schema.optional(Schema.String) },
      success: PeopleResponse,
    }),
  ) {}

export class SwapiFilmsApi extends HttpApiGroup.make("films").add(
  HttpApiEndpoint.get("get", "/films/:id/", {
    params: { id: Schema.Int },
    success: FilmResponse,
  }),
) {}

export class SwapiPlanetsApi extends HttpApiGroup.make("planets").add(
  HttpApiEndpoint.get("get", "/planets/:id/", {
    params: { id: Schema.Int },
    success: PlanetResponse,
  }),
) {}

export class SwapiSpeciesApi extends HttpApiGroup.make("species").add(
  HttpApiEndpoint.get("get", "/species/:id/", {
    params: { id: Schema.Int },
    success: SpeciesResponse,
  }),
) {}

export class SwapiStarshipsApi extends HttpApiGroup.make("starships").add(
  HttpApiEndpoint.get("get", "/starships/:id/", {
    params: { id: Schema.Int },
    success: StarshipResponse,
  }),
) {}

export class SwapiVehiclesApi extends HttpApiGroup.make("vehicles").add(
  HttpApiEndpoint.get("get", "/vehicles/:id/", {
    params: { id: Schema.Int },
    success: VehicleResponse,
  }),
) {}

export class SwapiApi extends HttpApi.make("SwapiApi")
  .add(SwapiPeopleApi)
  .add(SwapiFilmsApi)
  .add(SwapiPlanetsApi)
  .add(SwapiSpeciesApi)
  .add(SwapiStarshipsApi)
  .add(SwapiVehiclesApi) {}

export type SwapiClient = HttpApiClient.ForApi<typeof SwapiApi>;
