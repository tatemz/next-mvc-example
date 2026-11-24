import { Match, Schema } from "effect";
import { PersonViewModel } from "./PersonCard.model";

export const PersonCardInput = Schema.Struct({
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
});
export type PersonCardInput = typeof PersonCardInput.Type;

const displayMeasurement = (value: string): string =>
  Match.value(value).pipe(
    Match.whenOr("", "unknown", () => "Unknown"),
    Match.orElse((measurement) => measurement),
  );

export const makePersonViewModel = (person: PersonCardInput): PersonViewModel =>
  PersonViewModel.make({
    name: person.name,
    height: displayMeasurement(person.height),
    mass: displayMeasurement(person.mass),
    heightLabel: "Height",
    massLabel: "Mass",
  });
