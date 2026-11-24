import { Data, Effect, Option, Schema } from "effect";
import { makeFailedHomePageModel } from "../components/HomePage/HomePage.factory";
import type { HomePageViewModel } from "../components/HomePage/HomePage.model";
import { makeRetrySearchFormViewModel } from "../components/SearchForm/SearchForm.factory";
import { CharacterId } from "../domain/StarWars.model";
import { loadHomePageFor } from "./HomePage.controller";

class InvalidCharacterId extends Data.TaggedError("InvalidCharacterId")<{
  readonly characterId: string;
}> {}

const readCharacterId = (formData: FormData): string =>
  Option.getOrElse(
    Schema.decodeUnknownOption(Schema.String)(formData.get("characterId")),
    () => "",
  );

export const searchPerson = Effect.fn("searchPerson")(
  function*(_previous: HomePageViewModel, formData: FormData) {
    const characterId = readCharacterId(formData);
    const id = yield* Schema.decodeUnknownEffect(CharacterId)(characterId).pipe(
      Effect.mapError(() => new InvalidCharacterId({ characterId })),
    );
    return yield* loadHomePageFor(id);
  },
  Effect.catchTag("InvalidCharacterId", (error) =>
    Effect.succeed(
      makeFailedHomePageModel({
        form: makeRetrySearchFormViewModel(error.characterId),
        message: "Character id must be a positive whole number.",
      }),
    ),
  ),
);
