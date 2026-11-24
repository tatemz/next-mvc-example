import type { SearchFormViewModel } from "./model";

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
    <label htmlFor="characterId">Character id</label>
    <input
      key={model.characterId}
      id="characterId"
      name="characterId"
      defaultValue={model.characterId}
      inputMode="numeric"
    />
    <button type="submit" disabled={isPending}>
      {isPending ? "Loading..." : "Load character"}
    </button>
  </form>
);
