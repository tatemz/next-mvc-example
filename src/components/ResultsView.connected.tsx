"use client";

import { useEffect } from "react";
import {
  CtaClicked,
  PageContext,
  ResultsCtas,
  PageLoaded,
  makeTransportChoice,
  type ResultsContext,
  type ResultsCta,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import type { Universe } from "../domain/FilmUniverse.model";
import { ResultsView, ResultsViewModel } from "./ResultsView";

export type ConnectedResultsViewProps = {
  readonly model: ResultsViewModel;
};

const contextFor = (
  model: ResultsViewModel,
  universe: Universe,
): ResultsContext =>
  ResultsViewModel.match(model, {
    Ready: (ready) =>
      PageContext.cases.ResultsReady.make({
        universe,
        characterId: ready.person.id,
        filmOrder: ready.film.order,
        transport: makeTransportChoice(ready.transport),
      }),
    Missing: () =>
      PageContext.cases.ResultsMissing.make({ universe }),
  });

const ctaEventFor = (
  model: ResultsViewModel,
  universe: Universe,
  cta: ResultsCta,
): CtaClicked =>
  ResultsViewModel.match(model, {
    Ready: (ready) =>
      CtaClicked.cases.ResultsReadyCtaClicked.make({
        context: PageContext.cases.ResultsReady.make({
          universe,
          characterId: ready.person.id,
          filmOrder: ready.film.order,
          transport: makeTransportChoice(ready.transport),
        }),
        cta,
      }),
    Missing: () =>
      CtaClicked.cases.ResultsMissingCtaClicked.make({
        context: PageContext.cases.ResultsMissing.make({
          universe,
        }),
        cta: ResultsCtas.BuildAnotherDossier,
      }),
  });

export const ConnectedResultsView = ({
  model,
}: ConnectedResultsViewProps) => {
  const emit = useUiEventDispatch();
  const universe = model.shell.universe;

  useEffect(() => {
    emit(
      PageLoaded.make({
        context: contextFor(model, universe),
      }),
    );
  }, [emit, model, universe]);

  const onCtaClick = (cta: ResultsCta) =>
    emit(ctaEventFor(model, universe, cta));

  return <ResultsView model={model} onCtaClick={onCtaClick} />;
};
