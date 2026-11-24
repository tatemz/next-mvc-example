"use client";

import { useActionState } from "react";
import { searchPerson } from "../../actions/SearchPerson.serverAction";
import { HomePage, type HomePageViewModel } from "./HomePage";

export type ConnectedHomePageProps = HomePageViewModel;

export const ConnectedHomePage = (model: ConnectedHomePageProps) => {
  const [state, dispatch, isPending] = useActionState(searchPerson, model);
  return <HomePage {...state} dispatch={dispatch} isPending={isPending} />;
};
