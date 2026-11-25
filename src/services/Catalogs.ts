import { Context } from "effect";
import type { Universe } from "../domain/FilmUniverse.model";
import type { PeopleCatalog } from "./PeopleCatalog";

export class Catalogs extends Context.Service<
  Catalogs,
  Record<Universe, PeopleCatalog>
>()("next-mvc-example/Catalogs") {}
