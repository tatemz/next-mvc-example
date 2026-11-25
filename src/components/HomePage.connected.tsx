"use client";

import { useEffect } from "react";
import {
  CtaClicked,
  PageContext,
  PageLoaded,
  type Universe,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { HomePage, type HomePageViewModel } from "./HomePage";

export type ConnectedHomePageProps = {
  readonly model: HomePageViewModel;
  readonly universe: Universe;
};

export const ConnectedHomePage = ({
  model,
  universe,
}: ConnectedHomePageProps) => {
  const emit = useUiEventDispatch();

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

  return <HomePage model={model} onCtaClick={onCtaClick} />;
};
