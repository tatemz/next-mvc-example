"use client";

import { useEffect } from "react";
import {
  CtaClicked,
  PageContext,
  PageLoaded,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import type { Universe } from "../domain/FilmUniverse.model";
import { HomeView, type HomeViewModel } from "./HomeView";

export type ConnectedHomeViewProps = {
  readonly model: HomeViewModel;
  readonly universe: Universe;
};

export const ConnectedHomeView = ({
  model,
  universe,
}: ConnectedHomeViewProps) => {
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

  return <HomeView model={model} onCtaClick={onCtaClick} />;
};
