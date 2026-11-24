import type { FilmListItemViewModel } from "./FilmListItem.model";

export type FilmListItemProps = FilmListItemViewModel;

export const FilmListItem = ({ text }: FilmListItemProps) => (
  <li>{text}</li>
);
