import type { PersonViewModel } from "./PersonCard.model";

export type PersonCardProps = PersonViewModel;

export const PersonCard = ({
  name,
  height,
  mass,
  heightLabel,
  massLabel,
}: PersonCardProps) => (
  <section>
    <h1>{name}</h1>
    <dl>
      <dt>{heightLabel}</dt>
      <dd>{height}</dd>
      <dt>{massLabel}</dt>
      <dd>{mass}</dd>
    </dl>
  </section>
);
