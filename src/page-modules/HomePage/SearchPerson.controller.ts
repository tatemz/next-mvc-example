import { Effect, Option, Result, Schema } from "effect";
import { CharacterId } from "../../domain/CharacterId.model";
import { makeFailedHomePageModel } from "./HomePage.factory";
import type { HomePageViewModel } from "./HomePage.model";
import type { StarWarsClient } from "../../services/StarWarsClient";
import { loadHomePageFor } from "./HomePage.controller";

const readCharacterId = (formData: FormData): string =>
  Option.getOrElse(
    Schema.decodeUnknownOption(Schema.String)(formData.get("characterId")),
    () => "",
  );

export const searchPerson = (
  _previous: HomePageViewModel,
  formData: FormData,
): Effect.Effect<HomePageViewModel, never, StarWarsClient> =>
  Effect.gen(function*() {
    const characterId = readCharacterId(formData);
    const decoded = yield* Schema.decodeUnknownEffect(CharacterId)(
      characterId,
    ).pipe(Effect.result);

    if (Result.isFailure(decoded)) {
      return makeFailedHomePageModel({
        characterId,
        message: "Character id must be a positive whole number.",
      });
    }

    return yield* loadHomePageFor(decoded.success);
  });
