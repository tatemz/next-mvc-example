"use client";

import { useActionState } from "react";
import { searchPerson } from "../../actions/searchPerson.serverAction";
import type { HomePageViewModel } from "./model";
import { HomePage } from "./view";

export const ConnectedHomePage = ({
  model,
}: {
  readonly model: HomePageViewModel;
}) => {
  const [state, dispatch, isPending] = useActionState(searchPerson, model);
  return <HomePage model={state} dispatch={dispatch} isPending={isPending} />;
};
