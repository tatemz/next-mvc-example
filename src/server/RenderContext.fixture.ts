import { Context } from "effect";
import {
  Universes,
  type Person,
} from "../domain/FilmUniverse.model";
import {
  I18nCatalog,
  makeI18nCatalog,
} from "../i18n/I18n.service";
import { Catalogs } from "../services/Catalogs";
import { catalogOf } from "../services/PeopleCatalog.fixture";
import type { RenderServices } from "./RenderContext";

export const renderContext = (
  people: {
    readonly starWars?: ReadonlyArray<Person>;
    readonly ghibli?: ReadonlyArray<Person>;
  } = {},
): Context.Context<RenderServices> =>
  Context.make(I18nCatalog, I18nCatalog.of(makeI18nCatalog())).pipe(
    Context.add(
      Catalogs,
      Catalogs.of({
        [Universes.StarWars]: catalogOf(people.starWars ?? []),
        [Universes.Ghibli]: catalogOf(people.ghibli ?? []),
      }),
    ),
  );
