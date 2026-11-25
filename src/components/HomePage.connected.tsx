"use client";

import { useActionState } from "react";
import { HomePage, type HomePageViewModel } from "./HomePage";

type HomePageAction = (
  previous: HomePageViewModel,
  formData: FormData,
) => Promise<HomePageViewModel>;

export type ConnectedHomePageProps = {
  readonly model: HomePageViewModel;
  readonly searchAction: HomePageAction;
};

export const ConnectedHomePage = ({
  model,
  searchAction,
}: ConnectedHomePageProps) => {
  const [state, dispatch, isPending] = useActionState(searchAction, model);
  return <HomePage {...state} dispatch={dispatch} isPending={isPending} />;
};
