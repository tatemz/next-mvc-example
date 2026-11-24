import { Lens } from "@fuiste/optics";
import { Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";

export const SearchFormViewModel = Schema.TaggedStruct("SearchFormViewModel", {
  value: Schema.String,
  error: Schema.optional(Schema.String),
  label: Schema.NonEmptyString,
  submitLabel: Schema.NonEmptyString,
  pendingLabel: Schema.NonEmptyString,
});
export type SearchFormViewModel = typeof SearchFormViewModel.Type;

export const SearchFormOptics = {
  Value: Lens<SearchFormViewModel>().prop("value"),
  Error: Lens<SearchFormViewModel>().prop("error"),
};

export const makeInitialSearchFormViewModel = (
  i18n: I18n,
  value: string,
) =>
  SearchFormViewModel.make({
    value,
    label: i18n._({ id: "characterId.label" }),
    submitLabel: i18n._({ id: "search.submit" }),
    pendingLabel: i18n._({ id: "search.pending" }),
  });

export const makeRetrySearchFormViewModel = (
  i18n: I18n,
  value: string,
) =>
  SearchFormViewModel.make({
    value,
    label: i18n._({ id: "characterId.label" }),
    submitLabel: i18n._({ id: "search.retry" }),
    pendingLabel: i18n._({ id: "search.pending" }),
  });

export type SearchFormProps = SearchFormViewModel & {
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
};

export const SearchForm = ({
  value,
  error,
  label,
  submitLabel,
  pendingLabel,
  dispatch,
  isPending,
}: SearchFormProps) => (
  <form action={dispatch} method="post">
    <label htmlFor="characterId">{label}</label>
    <input
      key={value}
      id="characterId"
      name="characterId"
      defaultValue={value}
      inputMode="numeric"
      aria-invalid={error !== undefined}
      aria-describedby={
        error === undefined ? undefined : "characterId-error"
      }
    />
    {error === undefined ? null : (
      <p id="characterId-error" role="alert">
        {error}
      </p>
    )}
    <button type="submit" disabled={isPending}>
      {isPending ? pendingLabel : submitLabel}
    </button>
  </form>
);
