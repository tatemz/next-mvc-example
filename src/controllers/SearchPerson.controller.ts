import { Effect, Option, Schema, pipe } from "effect";
import type { HomePageViewModel } from "../components/HomePage/HomePage.model";
import { HomePageOptics } from "../components/HomePage/HomePage.optics";
import { CharacterId } from "../domain/StarWars.model";
import { loadHomePageFor } from "./HomePage.controller";

const invalidCharacterIdMessage =
  "Character id must be a positive whole number.";

const readCharacterId = (formData: FormData): string =>
  Option.getOrElse(
    Schema.decodeUnknownOption(Schema.String)(formData.get("characterId")),
    () => "",
  );

const withCharacterIdError = (
  model: HomePageViewModel,
  characterId: string,
) =>
  pipe(
    model,
    HomePageOptics.FormValue.set(characterId),
    HomePageOptics.FormError.set(invalidCharacterIdMessage),
  );

export const searchPerson = Effect.fn("searchPerson")(
  function*(previous: HomePageViewModel, formData: FormData) {
    const characterId = readCharacterId(formData);
    return yield* Schema.decodeUnknownEffect(CharacterId)(characterId).pipe(
      Effect.flatMap(loadHomePageFor),
      Effect.catchTag("SchemaError", () =>
        Effect.succeed(withCharacterIdError(previous, characterId)),
      ),
    );
  },
);
