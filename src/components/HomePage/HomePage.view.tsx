import { FilmList } from "../FilmList/FilmList.view";
import { PersonCard } from "../PersonCard/PersonCard.view";
import { SearchForm } from "../SearchForm/SearchForm.view";
import { HomePageViewModel } from "./HomePage.model";

type HomePageExtras = {
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
};

export type HomePageProps = HomePageViewModel & HomePageExtras;

type LoadedHomePageViewModel = Extract<
  HomePageViewModel,
  { readonly _tag: "Loaded" }
>;

type FailedHomePageViewModel = Extract<
  HomePageViewModel,
  { readonly _tag: "Failed" }
>;

type LoadedHomePageProps = LoadedHomePageViewModel & HomePageExtras;

type FailedHomePageProps = FailedHomePageViewModel & HomePageExtras;

const LoadedHomePage = ({
  person,
  filmList,
  form,
  dispatch,
  isPending,
}: LoadedHomePageProps) => (
  <>
    <PersonCard {...person} />
    <FilmList {...filmList} />
    <SearchForm
      {...form}
      dispatch={dispatch}
      isPending={isPending}
    />
  </>
);

const FailedHomePage = ({
  message,
  form,
  dispatch,
  isPending,
}: FailedHomePageProps) => (
  <>
    <p role="alert">{message}</p>
    <SearchForm
      {...form}
      dispatch={dispatch}
      isPending={isPending}
    />
  </>
);

export const HomePage = (props: HomePageProps) =>
  HomePageViewModel.match(props, {
    Loaded: (loaded) => (
      <LoadedHomePage
        {...loaded}
        dispatch={props.dispatch}
        isPending={props.isPending}
      />
    ),
    Failed: (failed) => (
      <FailedHomePage
        {...failed}
        dispatch={props.dispatch}
        isPending={props.isPending}
      />
    ),
  });
