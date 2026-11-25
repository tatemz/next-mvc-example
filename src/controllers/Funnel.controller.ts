import { Effect, Option, Schema } from "effect";
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
import type { UniverseServices } from "../page-modules/withUniverseServices";

export const startFunnel = ({ i18n, universe }: UniverseServices) =>
  makeFunnelSearchViewModel(i18n, universe, "", undefined);

export const advanceFunnel = (
  services: UniverseServices,
  previous: FunnelViewModel,
  formData: FormData,
) =>
  FunnelViewModel.match(previous, {
    Search: (step) =>
      Effect.gen(function*() {
        const form = Schema.decodeUnknownOption(FunnelSearchForm)(
          toRecord(formData),
        );

        if (Option.isNone(form)) {
          return makeFunnelSearchResult(services.i18n, step)({
            form,
            results: Option.none(),
          });
        }

        const results = yield* Effect.option(
          services.catalog.searchPeople(form.value.query),
        );
        return makeFunnelSearchResult(services.i18n, step)({
          form,
          results,
        });
      }),
    Choose: (step) =>
      Effect.gen(function*() {
        const form = Schema.decodeUnknownOption(FunnelChooseForm)(
          toRecord(formData),
        );
        const person: Option.Option<Person> = Option.isSome(form)
          ? yield* Effect.option(
            services.catalog.getPerson(form.value.characterId),
          )
          : Option.none();
        return makeFunnelChooseResult(services.i18n, step)({
          form,
          person,
        });
      }),
    Film: (step) =>
      Effect.succeed(
        makeFunnelFilmResult(services.i18n, step)({
          form: Schema.decodeUnknownOption(FunnelFilmForm)(
            toRecord(formData),
          ),
        }),
      ),
    Transport: (step) =>
      Effect.succeed(
        makeFunnelTransportResult(services.i18n, step)({
          form: Schema.decodeUnknownOption(FunnelTransportForm)(
            toRecord(formData),
          ),
        }),
      ),
    Review: (step) => Effect.succeed<FunnelViewModel>(step),
    Failed: (step) => Effect.succeed<FunnelViewModel>(step),
  });
