import { PersonViewModel } from "./PersonCard.model";

export type PersonCardInput = {
  readonly name: string;
  readonly height: string;
  readonly mass: string;
};

const displayMeasurement = (value: string): string =>
  value === "" || value === "unknown" ? "Unknown" : value;

export const makePersonViewModel = (person: PersonCardInput): PersonViewModel =>
  PersonViewModel.make({
    name: person.name,
    height: displayMeasurement(person.height),
    mass: displayMeasurement(person.mass),
    heightLabel: "Height",
    massLabel: "Mass",
  });
