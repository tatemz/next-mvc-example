import { Schema } from "effect";

export const FilmListItemViewModel = Schema.TaggedStruct(
  "FilmListItemViewModel",
  {
    order: Schema.Int,
    text: Schema.NonEmptyString,
    imageUrl: Schema.optional(Schema.String),
  },
);
export type FilmListItemViewModel = typeof FilmListItemViewModel.Type;

export const FilmListItemInput = Schema.Struct({
  title: Schema.NonEmptyString,
  order: Schema.Int,
  imageUrl: Schema.optional(Schema.String),
});
export type FilmListItemInput = typeof FilmListItemInput.Type;

export const makeFilmListItemViewModel = (film: FilmListItemInput) =>
  FilmListItemViewModel.make({
    order: film.order,
    text: film.title,
    ...(film.imageUrl === undefined ? {} : { imageUrl: film.imageUrl }),
  });

export type FilmListItemProps = FilmListItemViewModel;

export const FilmListItem = (model: FilmListItemProps) => (
  <li className="flex items-center gap-3 py-2">
    {model.imageUrl === undefined ? null : (
      <img
        src={model.imageUrl}
        alt=""
        className="h-24 w-16 rounded object-cover"
        loading="lazy"
      />
    )}
    <span>{model.text}</span>
  </li>
);
