import { Schema } from "effect";
import {
  HttpApi,
  HttpApiClient,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/http-api";
import { CharacterId } from "../domain/FilmUniverse.model";

export const SwapiPersonResponse = Schema.Struct({
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
export type SwapiPersonResponse = typeof SwapiPersonResponse.Type;

const SwapiPeopleResponse = Schema.Struct({
  count: Schema.Int,
  results: Schema.Array(SwapiPersonResponse),
});
type SwapiPeopleResponse = typeof SwapiPeopleResponse.Type;

export const SwapiFilmResponse = Schema.Struct({
  title: Schema.NonEmptyString,
  episode_id: Schema.Int,
});
export type SwapiFilmResponse = typeof SwapiFilmResponse.Type;

const SwapiPlanetResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  climate: Schema.String,
  terrain: Schema.String,
  url: Schema.String,
});
type SwapiPlanetResponse = typeof SwapiPlanetResponse.Type;

const SwapiSpeciesResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  classification: Schema.String,
  language: Schema.String,
  url: Schema.String,
});
type SwapiSpeciesResponse = typeof SwapiSpeciesResponse.Type;

const SwapiStarshipResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
  url: Schema.String,
});
type SwapiStarshipResponse = typeof SwapiStarshipResponse.Type;

const SwapiVehicleResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
  url: Schema.String,
});
type SwapiVehicleResponse = typeof SwapiVehicleResponse.Type;

class SwapiPeopleApi extends HttpApiGroup.make("people")
  .add(
    HttpApiEndpoint.get("get", "/people/:id/", {
      params: { id: CharacterId },
      success: SwapiPersonResponse,
    }),
  )
  .add(
    HttpApiEndpoint.get("search", "/people/", {
      query: { search: Schema.optional(Schema.String) },
      success: SwapiPeopleResponse,
    }),
  ) {}

class SwapiFilmsApi extends HttpApiGroup.make("films").add(
  HttpApiEndpoint.get("get", "/films/:id/", {
    params: { id: Schema.Int },
    success: SwapiFilmResponse,
  }),
) {}

class SwapiPlanetsApi extends HttpApiGroup.make("planets").add(
  HttpApiEndpoint.get("get", "/planets/:id/", {
    params: { id: Schema.Int },
    success: SwapiPlanetResponse,
  }),
) {}

class SwapiSpeciesApi extends HttpApiGroup.make("species").add(
  HttpApiEndpoint.get("get", "/species/:id/", {
    params: { id: Schema.Int },
    success: SwapiSpeciesResponse,
  }),
) {}

class SwapiStarshipsApi extends HttpApiGroup.make("starships").add(
  HttpApiEndpoint.get("get", "/starships/:id/", {
    params: { id: Schema.Int },
    success: SwapiStarshipResponse,
  }),
) {}

class SwapiVehiclesApi extends HttpApiGroup.make("vehicles").add(
  HttpApiEndpoint.get("get", "/vehicles/:id/", {
    params: { id: Schema.Int },
    success: SwapiVehicleResponse,
  }),
) {}

export class SwapiApi extends HttpApi.make("SwapiApi")
  .add(SwapiPeopleApi)
  .add(SwapiFilmsApi)
  .add(SwapiPlanetsApi)
  .add(SwapiSpeciesApi)
  .add(SwapiStarshipsApi)
  .add(SwapiVehiclesApi) {}

export type SwapiApiClient = HttpApiClient.ForApi<typeof SwapiApi>;
