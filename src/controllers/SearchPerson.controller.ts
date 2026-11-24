import { Effect, Option, Schema, pipe } from "effect";
import type { HomePageViewModel } from "../components/HomePage/HomePage.model";
import { HomePageOptics } from "../components/HomePage/HomePage.optics";
import { CharacterId } from "../domain/StarWars.model";
import { I18n } from "../i18n/I18n.service";
import { loadHomePageFor } from "./HomePage.controller";

const readCharacterId = (formData: FormData): string =>
  Option.getOrElse(
    Schema.decodeUnknownOption(Schema.String)(formData.get("characterId")),
    () => "",
  );

const withCharacterIdError = (
  i18n: I18n,
  model: HomePageViewModel,
  characterId: string,
) =>
  pipe(
    model,
    HomePageOptics.FormValue.set(characterId),
    HomePageOptics.FormError.set(
      i18n._({ id: "search.invalidCharacterId" }),
    ),
  );

export const searchPerson = Effect.fn("searchPerson")(
  function*(previous: HomePageViewModel, formData: FormData) {
    const i18n = yield* I18n;
    const characterId = readCharacterId(formData);
    return yield* Schema.decodeUnknownEffect(CharacterId)(characterId).pipe(
      Effect.flatMap(loadHomePageFor),
      Effect.catchTag("SchemaError", () =>
        Effect.succeed(withCharacterIdError(i18n, previous, characterId)),
      ),
    );
  },
);
