import { Function, Match, Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";

export const PersonViewModel = Schema.TaggedStruct("PersonViewModel", {
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  heightLabel: Schema.NonEmptyString,
  massLabel: Schema.NonEmptyString,
});
export type PersonViewModel = typeof PersonViewModel.Type;

export const PersonCardInput = Schema.Struct({
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
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
    name: person.name,
    height: displayMeasurement(i18n, person.height),
    mass: displayMeasurement(i18n, person.mass),
    heightLabel: i18n._({ id: "person.heightLabel" }),
    massLabel: i18n._({ id: "person.massLabel" }),
  });

export type PersonCardProps = PersonViewModel;

export const PersonCard = (model: PersonCardProps) => (
  <section>
    <h1>{model.name}</h1>
    <dl>
      <dt>{model.heightLabel}</dt>
      <dd>{model.height}</dd>
      <dt>{model.massLabel}</dt>
      <dd>{model.mass}</dd>
    </dl>
  </section>
);
