import { Array, Function, Match, Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import {
  FilmListItemViewModel,
  FilmListItemInput,
  makeFilmListItemViewModel,
} from "../FilmListItem/FilmListItem";

export const PlanetViewModel = Schema.TaggedStruct("PlanetViewModel", {
  name: Schema.NonEmptyString,
  climate: Schema.String,
  terrain: Schema.String,
});
export type PlanetViewModel = typeof PlanetViewModel.Type;

export const SpeciesViewModel = Schema.TaggedStruct("SpeciesViewModel", {
  name: Schema.NonEmptyString,
  classification: Schema.String,
  language: Schema.String,
});
export type SpeciesViewModel = typeof SpeciesViewModel.Type;

export const TransportKind = Schema.Literals(["Starship", "Vehicle"]);
export type TransportKind = typeof TransportKind.Type;

export const TransportViewModel = Schema.TaggedStruct("TransportViewModel", {
  key: Schema.NonEmptyString,
  kind: TransportKind,
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
});
export type TransportViewModel = typeof TransportViewModel.Type;

export const PersonViewModel = Schema.TaggedStruct("PersonViewModel", {
  id: Schema.String,
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  birthYear: Schema.String,
  gender: Schema.String,
  heightLabel: Schema.NonEmptyString,
  massLabel: Schema.NonEmptyString,
  birthYearLabel: Schema.NonEmptyString,
  genderLabel: Schema.NonEmptyString,
  homeworldLabel: Schema.NonEmptyString,
  speciesLabel: Schema.NonEmptyString,
  speciesUnknownLabel: Schema.NonEmptyString,
  homeworld: PlanetViewModel,
  species: Schema.NullOr(SpeciesViewModel),
  films: Schema.NonEmptyArray(FilmListItemViewModel),
  transports: Schema.Array(TransportViewModel),
});
export type PersonViewModel = typeof PersonViewModel.Type;

const PlanetInput = Schema.Struct({
  name: Schema.NonEmptyString,
  climate: Schema.String,
  terrain: Schema.String,
});

const SpeciesInput = Schema.Struct({
  name: Schema.NonEmptyString,
  classification: Schema.String,
  language: Schema.String,
});

const TransportInput = Schema.Struct({
  key: Schema.NonEmptyString,
  kind: TransportKind,
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
});

export const PersonCardInput = Schema.Struct({
  id: Schema.String,
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  birthYear: Schema.String,
  gender: Schema.String,
  homeworld: PlanetInput,
  species: Schema.NullOr(SpeciesInput),
  films: Schema.NonEmptyArray(FilmListItemInput),
  transports: Schema.Array(TransportInput),
});
export type PersonCardInput = typeof PersonCardInput.Type;

const displayMeasurement = (i18n: I18n, value: string): string =>
  Function.pipe(
    value,
    Match.value,
    Match.whenOr("", "unknown", () =>
      i18n._({ id: "person.unknownMeasurement" }),
    ),
    Match.orElse(Function.identity<string>),
  );

export const makePersonViewModel = (
  i18n: I18n,
  person: PersonCardInput,
) =>
  PersonViewModel.make({
    id: person.id,
    name: person.name,
    height: displayMeasurement(i18n, person.height),
    mass: displayMeasurement(i18n, person.mass),
    birthYear: person.birthYear,
    gender: person.gender,
    heightLabel: i18n._({ id: "person.heightLabel" }),
    massLabel: i18n._({ id: "person.massLabel" }),
    birthYearLabel: i18n._({ id: "person.birthYearLabel" }),
    genderLabel: i18n._({ id: "person.genderLabel" }),
    homeworldLabel: i18n._({ id: "person.homeworldLabel" }),
    speciesLabel: i18n._({ id: "person.speciesLabel" }),
    speciesUnknownLabel: i18n._({ id: "person.unknownSpecies" }),
    homeworld: PlanetViewModel.make({
      name: person.homeworld.name,
      climate: person.homeworld.climate,
      terrain: person.homeworld.terrain,
    }),
    species:
      person.species === null
        ? null
        : SpeciesViewModel.make({
            name: person.species.name,
            classification: person.species.classification,
            language: person.species.language,
          }),
    films: Function.pipe(
      person.films,
      Array.map((film) => makeFilmListItemViewModel(i18n, film)),
    ),
    transports: person.transports.map((transport) =>
      TransportViewModel.make({
        key: transport.key,
        kind: transport.kind,
        name: transport.name,
        model: transport.model,
      }),
    ),
  });

export type PersonCardProps = PersonViewModel;

export const PersonCard = (model: PersonCardProps) => (
  <article className="card bg-base-100 shadow-xl">
    <div className="card-body gap-4">
      <h1 className="card-title text-3xl">{model.name}</h1>
      <div className="stats stats-vertical bg-base-200 sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">{model.heightLabel}</div>
          <div className="stat-value text-lg">{model.height}</div>
        </div>
        <div className="stat">
          <div className="stat-title">{model.massLabel}</div>
          <div className="stat-value text-lg">{model.mass}</div>
        </div>
        <div className="stat">
          <div className="stat-title">{model.birthYearLabel}</div>
          <div className="stat-value text-lg">{model.birthYear}</div>
        </div>
        <div className="stat">
          <div className="stat-title">{model.genderLabel}</div>
          <div className="stat-value text-lg capitalize">{model.gender}</div>
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide opacity-60">
            {model.homeworldLabel}
          </dt>
          <dd className="text-lg">{model.homeworld.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide opacity-60">
            {model.speciesLabel}
          </dt>
          <dd className="text-lg">
            {model.species?.name ?? model.speciesUnknownLabel}
          </dd>
        </div>
      </dl>
    </div>
  </article>
);
