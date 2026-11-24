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
  films: Schema.NonEmptyArray(Schema.String),
});
export type PersonResponse = typeof PersonResponse.Type;

export const FilmResponse = Schema.Struct({
  title: Schema.NonEmptyString,
  episode_id: Schema.Int,
});
export type FilmResponse = typeof FilmResponse.Type;

export class SwapiPeopleApi extends HttpApiGroup.make("people")
  .add(
    HttpApiEndpoint.get("get", "/people/:id/", {
      params: { id: CharacterId },
      success: PersonResponse,
    }),
  ) {}

export class SwapiFilmsApi extends HttpApiGroup.make("films")
  .add(
    HttpApiEndpoint.get("get", "/films/:id/", {
      params: { id: Schema.Int },
      success: FilmResponse,
    }),
  ) {}

export class SwapiApi extends HttpApi.make("SwapiApi")
  .add(SwapiPeopleApi)
  .add(SwapiFilmsApi) {}

export type SwapiClient = HttpApiClient.ForApi<typeof SwapiApi>;
