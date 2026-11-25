"use client";

import { useEffect, useActionState } from "react";
import {
  CtaClicked,
  FormValidationError,
  InputFilled,
  PageLoaded,
  type Universe,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { HomePage, type HomePageViewModel } from "./HomePage";

type HomePageAction = (
  previous: HomePageViewModel,
  formData: FormData,
) => Promise<HomePageViewModel>;

export type ConnectedHomePageProps = {
  readonly model: HomePageViewModel;
  readonly searchAction: HomePageAction;
  readonly universe: Universe;
};

export const ConnectedHomePage = ({
  model,
  searchAction,
  universe,
}: ConnectedHomePageProps) => {
  const emit = useUiEventDispatch();
  const [state, dispatch, isPending] = useActionState(searchAction, model);
  const characterId = state._tag === "Loaded" ? state.person.id : undefined;

  useEffect(() => {
    emit(
      PageLoaded.make({
        page: "home",
        universe,
        ...(characterId === undefined ? {} : { characterId }),
      }),
    );
  }, [emit, universe]);

  useEffect(() => {
    if (state.form.error !== undefined) {
      emit(
        FormValidationError.make({
          page: "home",
          universe,
          form: "home_search",
          message: state.form.error,
          characterId: state.form.value,
        }),
      );
    }
  }, [emit, state.form.error, state.form.value, universe]);

  const onCtaClick = () =>
    emit(
      CtaClicked.make({
        page: "home",
        universe,
        cta: "build_dossier",
        ...(characterId === undefined ? {} : { characterId }),
      }),
    );

  const onSubmit = () =>
    emit(
      CtaClicked.make({
        page: "home",
        universe,
        cta: "load_character",
        characterId: state.form.value,
      }),
    );

  const onCharacterIdChange = (value: string) =>
    emit(
      InputFilled.make({
        page: "home",
        universe,
        field: "characterId",
        value,
      }),
    );

  return (
    <HomePage
      {...state}
      dispatch={dispatch}
      isPending={isPending}
      onCtaClick={onCtaClick}
      onCharacterIdChange={onCharacterIdChange}
      onSubmit={onSubmit}
    />
  );
};
