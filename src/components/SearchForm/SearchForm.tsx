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
  dispatch,
  isPending,
  ...model
}: SearchFormProps) => (
  <form
    action={dispatch}
    method="post"
    className="card bg-base-100 shadow-xl"
  >
    <div className="card-body gap-3">
      <label htmlFor="characterId" className="label-text">
        {model.label}
      </label>
      <input
        key={model.value}
        id="characterId"
        name="characterId"
        defaultValue={model.value}
        inputMode="numeric"
        className={`input input-bordered w-full${
          model.error === undefined ? "" : " input-error"
        }`}
        aria-invalid={model.error !== undefined}
        aria-describedby={
          model.error === undefined ? undefined : "characterId-error"
        }
      />
      {model.error === undefined ? null : (
        <p id="characterId-error" role="alert" className="text-sm text-error">
          {model.error}
        </p>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isPending}
      >
        {isPending ? model.pendingLabel : model.submitLabel}
      </button>
    </div>
  </form>
);
