import { Effect, Option, Schema } from "effect";
import { makeAppShellViewModel } from "../components/AppShell";
import {
  FunnelViewModel,
  makeFunnelChooseResult,
  makeFunnelFilmResult,
  makeFunnelSearchResult,
  makeFunnelSearchViewModel,
  makeFunnelTransportResult,
} from "../components/FunnelView";
import {
  CharacterId,
  type Person,
  type Universe,
} from "../domain/FilmUniverse.model";
import { getStringOrEmpty, toRecord } from "../forms/FormData";
import { I18n } from "../i18n/I18n.service";
import { PeopleCatalog } from "../services/PeopleCatalog";

export const startFunnel = (universe: Universe) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const shell = makeAppShellViewModel(i18n, universe);
    return makeFunnelSearchViewModel(i18n, shell, "", undefined);
  });

export const advanceFunnel = (
  previous: FunnelViewModel,
  formData: FormData,
) =>
  FunnelViewModel.match(previous, {
    Search: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const query = getStringOrEmpty("query")(toRecord(formData)).trim();

        if (query === "") {
          return makeFunnelSearchViewModel(
            i18n,
            step.shell,
            query,
            i18n._({ id: "funnel.search.required" }),
          );
        }

        const client = yield* PeopleCatalog;
        const results = yield* Effect.option(client.searchPeople(query));
        return makeFunnelSearchResult(i18n, step, query, results);
      }),
    Choose: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const characterId = Schema.decodeOption(CharacterId)(
          getStringOrEmpty("characterId")(toRecord(formData)),
        );
        const client = yield* PeopleCatalog;
        const person: Option.Option<Person> = Option.isSome(characterId)
          ? yield* Effect.option(client.getPerson(characterId.value))
          : Option.none();
        return makeFunnelChooseResult(i18n, step, characterId, person);
      }),
    Film: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const order = Schema.decodeOption(
          Schema.NumberFromString.check(Schema.isInt()),
        )(getStringOrEmpty("order")(toRecord(formData)));
        return makeFunnelFilmResult(i18n, step, order);
      }),
    Transport: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const transportKey = getStringOrEmpty("transportKey")(
          toRecord(formData),
        );
        return makeFunnelTransportResult(i18n, step, transportKey);
      }),
    Review: (step) => Effect.succeed<FunnelViewModel>(step),
    Failed: (step) => Effect.succeed<FunnelViewModel>(step),
  });
