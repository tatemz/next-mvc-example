import type { PersonViewModel } from "./model";

export type PersonCardProps = {
  readonly model: PersonViewModel;
};

export const PersonCard = ({ model }: PersonCardProps) => (
  <section>
    <h1>{model.name}</h1>
    <dl>
      <dt>Height</dt>
      <dd>{model.height}</dd>
      <dt>Mass</dt>
      <dd>{model.mass}</dd>
    </dl>
  </section>
);
