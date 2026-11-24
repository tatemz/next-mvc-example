import type { SearchFormViewModel } from "./SearchForm.model";

export type SearchFormProps = {
  readonly model: SearchFormViewModel;
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
};

export const SearchForm = ({
  model,
  dispatch,
  isPending,
}: SearchFormProps) => (
  <form action={dispatch} method="post">
    <label htmlFor="characterId">{model.label}</label>
    <input
      key={model.value}
      id="characterId"
      name="characterId"
      defaultValue={model.value}
      inputMode="numeric"
      aria-invalid={model.error !== undefined}
      aria-describedby={
        model.error === undefined ? undefined : "characterId-error"
      }
    />
    {model.error === undefined ? null : (
      <p id="characterId-error" role="alert">
        {model.error}
      </p>
    )}
    <button type="submit" disabled={isPending}>
      {isPending ? model.pendingLabel : model.submitLabel}
    </button>
  </form>
);
