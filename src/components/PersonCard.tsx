import { Array, Function, Match, Option, Schema } from "effect";
import type { I18n } from "../i18n/I18n.service";
import {
  FilmListItemViewModel,
  FilmListItemInput,
  makeFilmListItemViewModel,
} from "./FilmListItem";

const OriginViewModel = Schema.TaggedStruct("OriginViewModel", {
  name: Schema.NonEmptyString,
  climate: Schema.String,
  terrain: Schema.String,
});
type OriginViewModel = typeof OriginViewModel.Type;

const SpeciesViewModel = Schema.TaggedStruct("SpeciesViewModel", {
  name: Schema.NonEmptyString,
  classification: Schema.String,
  language: Schema.String,
});
type SpeciesViewModel = typeof SpeciesViewModel.Type;

const TransportKind = Schema.Literals(["Starship", "Vehicle"]);
type TransportKind = typeof TransportKind.Type;

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
  originLabel: Schema.NonEmptyString,
  speciesLabel: Schema.NonEmptyString,
  speciesUnknownLabel: Schema.NonEmptyString,
  origin: OriginViewModel,
  species: Schema.NullOr(SpeciesViewModel),
  films: Schema.NonEmptyArray(FilmListItemViewModel),
  transports: Schema.Array(TransportViewModel),
});
export type PersonViewModel = typeof PersonViewModel.Type;

const OriginInput = Schema.Struct({
  name: Schema.NonEmptyString,
  climate: Schema.String,
  terrain: Schema.String,
});

const SpeciesInput = Schema.Struct({
  name: Schema.NonEmptyString,
  classification: Schema.String,
  language: Schema.String,
});

export const TransportInput = Schema.Struct({
  key: Schema.NonEmptyString,
  kind: TransportKind,
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
});
export type TransportInput = typeof TransportInput.Type;

export const PersonCardInput = Schema.Struct({
  id: Schema.String,
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  birthYear: Schema.String,
  gender: Schema.String,
  origin: OriginInput,
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

export const makeTransportViewModel = (transport: TransportInput) =>
  TransportViewModel.make({
    key: transport.key,
    kind: transport.kind,
    name: transport.name,
    model: transport.model,
  });

export const makePersonViewModel = (
  i18n: I18n,
  person: PersonCardInput,
) =>
  PersonViewModel.make({
    id: person.id,
    name: person.name,
    height: displayMeasurement(i18n, person.height),
    mass: displayMeasurement(i18n, person.mass),
    birthYear: displayMeasurement(i18n, person.birthYear),
    gender: person.gender,
    heightLabel: i18n._({ id: "person.heightLabel" }),
    massLabel: i18n._({ id: "person.massLabel" }),
    birthYearLabel: i18n._({ id: "person.birthYearLabel" }),
    genderLabel: i18n._({ id: "person.genderLabel" }),
    originLabel: i18n._({ id: "person.originLabel" }),
    speciesLabel: i18n._({ id: "person.speciesLabel" }),
    speciesUnknownLabel: i18n._({ id: "person.unknownSpecies" }),
    origin: OriginViewModel.make({
      name: person.origin.name,
      climate: person.origin.climate,
      terrain: person.origin.terrain,
    }),
    species: Option.match(Option.fromNullishOr(person.species), {
      onNone: () => null,
      onSome: (species) =>
        SpeciesViewModel.make({
          name: species.name,
          classification: species.classification,
          language: species.language,
        }),
    }),
    films: Function.pipe(
      person.films,
      Array.map(makeFilmListItemViewModel),
    ),
    transports: Array.map(person.transports, makeTransportViewModel),
  });

const Stat = ({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) => (
  <div className="rounded-box bg-base-200 p-3">
    <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
    <div className="text-lg font-semibold capitalize">{value}</div>
  </div>
);

export type PersonCardProps = PersonViewModel;

export const PersonCard = (model: PersonCardProps) => (
  <article className="card bg-base-100 shadow-xl">
    <div className="card-body gap-4">
      <h1 className="card-title text-3xl">{model.name}</h1>
      <div className="grid grid-cols-2 gap-3">
        <Stat label={model.heightLabel} value={model.height} />
        <Stat label={model.massLabel} value={model.mass} />
        <Stat label={model.birthYearLabel} value={model.birthYear} />
        <Stat label={model.genderLabel} value={model.gender} />
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide opacity-60">
            {model.originLabel}
          </dt>
          <dd className="text-lg">{model.origin.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide opacity-60">
            {model.speciesLabel}
          </dt>
          <dd className="text-lg">
            {Option.match(Option.fromNullishOr(model.species), {
              onNone: () => model.speciesUnknownLabel,
              onSome: (species) => species.name,
            })}
          </dd>
        </div>
      </dl>
    </div>
  </article>
);
