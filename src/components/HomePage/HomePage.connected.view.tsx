"use client";

import { useActionState } from "react";
import { searchPerson } from "../../actions/SearchPerson.serverAction";
import type { HomePageViewModel } from "./HomePage.model";
import { HomePage } from "./HomePage.view";

export const ConnectedHomePage = ({
  model,
}: {
  readonly model: HomePageViewModel;
}) => {
  const [state, dispatch, isPending] = useActionState(searchPerson, model);
  return <HomePage model={state} dispatch={dispatch} isPending={isPending} />;
};
