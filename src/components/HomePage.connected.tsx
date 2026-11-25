"use client";

import { useEffect } from "react";
import { CtaClicked, PageLoaded } from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { HomePage, type HomePageViewModel } from "./HomePage";

export type ConnectedHomePageProps = {
  readonly model: HomePageViewModel;
};

export const ConnectedHomePage = ({ model }: ConnectedHomePageProps) => {
  const emit = useUiEventDispatch();

  useEffect(() => {
    emit(
      PageLoaded.make({
        page: "home",
        universe: model.universe,
      }),
    );
  }, [emit, model.universe]);

  const onCtaClick = () =>
    emit(
      CtaClicked.make({
        page: "home",
        universe: model.universe,
        cta: "build_dossier",
      }),
    );

  return <HomePage {...model} onCtaClick={onCtaClick} />;
};
