import type { FilmListItemViewModel } from "./FilmListItem.model";

export type FilmListItemProps = {
  readonly model: FilmListItemViewModel;
};

export const FilmListItem = ({ model }: FilmListItemProps) => (
  <li>{model.text}</li>
);
