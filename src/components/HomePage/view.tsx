import { FilmList } from "../FilmList/view";
import { PersonCard } from "../PersonCard/view";
import { SearchForm } from "../SearchForm/view";
import { HomePageViewModel } from "./model";

export type HomePageProps = {
  readonly model: HomePageViewModel;
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
};

export const HomePage = ({
  model,
  dispatch,
  isPending,
}: HomePageProps) =>
  HomePageViewModel.match(model, {
    Loaded: (loaded) => (
      <>
        <PersonCard model={loaded.person} />
        <FilmList films={loaded.films} />
        <SearchForm
          model={loaded.form}
          dispatch={dispatch}
          isPending={isPending}
        />
      </>
    ),
    Failed: (failed) => (
      <>
        <p role="alert">{failed.message}</p>
        <SearchForm
          model={failed.form}
          dispatch={dispatch}
          isPending={isPending}
        />
      </>
    ),
  });
