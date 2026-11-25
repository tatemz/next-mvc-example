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
import type { Person } from "../domain/FilmUniverse.model";
import {
  FunnelChooseForm,
  FunnelFilmForm,
  FunnelSearchForm,
  FunnelTransportForm,
} from "../forms/FunnelForm";
import { toRecord } from "../forms/FormData";
import { I18n } from "../i18n/I18n.service";
import { makeNotFoundViewModel } from "../components/NotFoundView";
import { currentUniverse } from "./Universe.controller";
import { PeopleCatalog } from "../services/PeopleCatalog";

export const startFunnel = Effect.gen(function*() {
  const i18n = yield* I18n;
  const universe = yield* currentUniverse;
  return Option.match(universe, {
    onNone: () => makeNotFoundViewModel(i18n),
    onSome: (value) =>
      makeFunnelSearchViewModel(i18n, value, "", undefined),
  });
});

export const advanceFunnel = (
  previous: FunnelViewModel,
  formData: FormData,
) =>
  FunnelViewModel.match(previous, {
    Search: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const form = Schema.decodeUnknownOption(FunnelSearchForm)(
          toRecord(formData),
        );

        if (Option.isNone(form)) {
          return makeFunnelSearchResult(i18n, step)({
            form,
            results: Option.none(),
          });
        }

        const client = yield* PeopleCatalog;
        const results = yield* Effect.option(
          client.searchPeople(form.value.query),
        );
        return makeFunnelSearchResult(i18n, step)({ form, results });
      }),
    Choose: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const form = Schema.decodeUnknownOption(FunnelChooseForm)(
          toRecord(formData),
        );
        const client = yield* PeopleCatalog;
        const person: Option.Option<Person> = Option.isSome(form)
          ? yield* Effect.option(client.getPerson(form.value.characterId))
          : Option.none();
        return makeFunnelChooseResult(i18n, step)({ form, person });
      }),
    Film: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const form = Schema.decodeUnknownOption(FunnelFilmForm)(
          toRecord(formData),
        );
        return makeFunnelFilmResult(i18n, step)({ form });
      }),
    Transport: (step) =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const form = Schema.decodeUnknownOption(FunnelTransportForm)(
          toRecord(formData),
        );
        return makeFunnelTransportResult(i18n, step)({ form });
      }),
    Review: (step) => Effect.succeed<FunnelViewModel>(step),
    Failed: (step) => Effect.succeed<FunnelViewModel>(step),
  });
