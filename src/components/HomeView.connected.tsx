"use client";

import { useEffect } from "react";
import {
  CtaClicked,
  PageContext,
  PageLoaded,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { HomeView, type HomeViewModel } from "./HomeView";

export type ConnectedHomeViewProps = {
  readonly model: HomeViewModel;
};

export const ConnectedHomeView = ({ model }: ConnectedHomeViewProps) => {
  const emit = useUiEventDispatch();
  const universe = model.shell.universe;

  useEffect(() => {
    emit(
      PageLoaded.make({
        context: PageContext.cases.Home.make({
          universe,
        }),
      }),
    );
  }, [emit, universe]);

  const onCtaClick = () =>
    emit(
      CtaClicked.cases.HomeCtaClicked.make({
        context: PageContext.cases.Home.make({
          universe,
        }),
        cta: "build_dossier",
      }),
    );

  return <HomeView model={model} onCtaClick={onCtaClick} />;
};
