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
      key={model.characterId}
      id="characterId"
      name="characterId"
      defaultValue={model.characterId}
      inputMode="numeric"
    />
    <button type="submit" disabled={isPending}>
      {isPending ? model.pendingLabel : model.submitLabel}
    </button>
  </form>
);
