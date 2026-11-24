import { FilmList } from "../FilmList/FilmList.view";
import { PersonCard } from "../PersonCard/PersonCard.view";
import { SearchForm } from "../SearchForm/SearchForm.view";
import { HomePageViewModel } from "./HomePage.model";

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
        <FilmList model={loaded.filmList} />
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
