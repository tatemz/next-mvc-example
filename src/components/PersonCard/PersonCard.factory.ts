import { PersonViewModel } from "./PersonCard.model";

export type PersonCardInput = {
  readonly name: string;
  readonly height: string;
  readonly mass: string;
};

export const makePersonViewModel = (person: PersonCardInput): PersonViewModel =>
  PersonViewModel.make({
    name: person.name,
    height: person.height,
    mass: person.mass,
    heightLabel: "Height",
    massLabel: "Mass",
  });
