"use client";

import { Match } from "effect";
import { useEffect } from "react";
import {
  CtaClicked,
  PageLoaded,
  type Universe,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { Results, type ResultsCta, type ResultsViewModel } from "./Results";

export type ConnectedResultsProps = {
  readonly model: ResultsViewModel;
  readonly universe: Universe;
};

const metadataFor = (model: ResultsViewModel) =>
  Match.valueTags(model, {
    Ready: (ready) => ({
      characterId: ready.person.id,
      filmOrder: ready.film.order,
      ...(ready.transport === null
        ? {}
        : { transportKey: ready.transport.key }),
    }),
    Missing: () => ({}),
  });

export const ConnectedResults = ({
  model,
  universe,
}: ConnectedResultsProps) => {
  const emit = useUiEventDispatch();
  const metadata = metadataFor(model);

  useEffect(() => {
    emit(PageLoaded.make({ page: "results", universe, ...metadata }));
  }, [emit, model, universe]);

  const onCtaClick = (cta: ResultsCta) =>
    emit(
      CtaClicked.make({
        page: "results",
        universe,
        cta,
        ...metadata,
      }),
    );

  return <Results model={model} onCtaClick={onCtaClick} />;
};
