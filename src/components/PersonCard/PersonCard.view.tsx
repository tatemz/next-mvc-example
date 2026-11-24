import type { PersonViewModel } from "./PersonCard.model";

export type PersonCardProps = {
  readonly model: PersonViewModel;
};

export const PersonCard = ({ model }: PersonCardProps) => (
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
