import { Effect, Result, Schema } from "effect";
import { makeFailedHomePageModel } from "../components/HomePage/factory";
import type { HomePageViewModel } from "../components/HomePage/model";
import type { StarWarsClient } from "../services/StarWarsClient";
import { loadHomePageFor } from "./homePage.controller";

const SearchFormInput = Schema.Struct({
  characterId: Schema.NumberFromString.check(
    Schema.isInt(),
    Schema.isGreaterThan(0),
  ),
});

const readCharacterId = (formData: FormData) => {
  const value = formData.get("characterId");
  return typeof value === "string" ? value : "";
};

export const searchPerson = (
  _previous: HomePageViewModel,
  formData: FormData,
): Effect.Effect<HomePageViewModel, never, StarWarsClient> =>
  Effect.gen(function*() {
    const characterId = readCharacterId(formData);
    const decoded = yield* Schema.decodeUnknownEffect(SearchFormInput)({
      characterId,
    }).pipe(Effect.result);

    if (Result.isFailure(decoded)) {
      return makeFailedHomePageModel({
        characterId,
        message: "Character id must be a positive whole number.",
      });
    }

    return yield* loadHomePageFor(decoded.success.characterId);
  });
