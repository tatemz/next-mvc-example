import type { SearchFormViewModel } from "./SearchForm.model";

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
