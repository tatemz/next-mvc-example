"use client";

import { useActionState } from "react";
import { searchPerson } from "../../actions/SearchPerson.serverAction";
import type { HomePageViewModel } from "./HomePage.model";
import { HomePage } from "./HomePage.view";

export type ConnectedHomePageProps = HomePageViewModel;

export const ConnectedHomePage = (model: ConnectedHomePageProps) => {
  const [state, dispatch, isPending] = useActionState(searchPerson, model);
  return <HomePage {...state} dispatch={dispatch} isPending={isPending} />;
};
