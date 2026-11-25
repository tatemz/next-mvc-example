"use client";

import { useEffect } from "react";
import {
  HomeContext,
  HomeCtaClicked,
  PageLoaded,
} from "../ui-events/UiEvent";
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
        context: HomeContext.make({ universe: model.universe }),
      }),
    );
  }, [emit, model.universe]);

  const onCtaClick = () =>
    emit(
      HomeCtaClicked.make({
        context: HomeContext.make({ universe: model.universe }),
        cta: "build_dossier",
      }),
    );

  return <HomePage {...model} onCtaClick={onCtaClick} />;
};
