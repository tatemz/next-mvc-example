import { Match, Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import { PersonViewModel } from "./PersonCard.model";

export const PersonCardInput = Schema.Struct({
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
});
export type PersonCardInput = typeof PersonCardInput.Type;

const displayMeasurement = (i18n: I18n, value: string): string =>
  Match.value(value).pipe(
    Match.whenOr("", "unknown", () =>
      i18n._({ id: "person.unknownMeasurement" }),
    ),
    Match.orElse((measurement) => measurement),
  );

export const makePersonViewModel = (
  i18n: I18n,
  person: PersonCardInput,
): PersonViewModel =>
  PersonViewModel.make({
    name: person.name,
    height: displayMeasurement(i18n, person.height),
    mass: displayMeasurement(i18n, person.mass),
    heightLabel: i18n._({ id: "person.heightLabel" }),
    massLabel: i18n._({ id: "person.massLabel" }),
  });
