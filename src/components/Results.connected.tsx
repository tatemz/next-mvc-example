"use client";

import { Match } from "effect";
import { useEffect } from "react";
import {
  PageLoaded,
  ResultsMissingContext,
  ResultsMissingCtaClicked,
  ResultsReadyContext,
  ResultsReadyCtaClicked,
  makeTransportChoice,
  type CtaClicked,
  type ResultsContext,
  type ResultsCta,
  type Universe,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { Results, type ResultsViewModel } from "./Results";

export type ConnectedResultsProps = {
  readonly model: ResultsViewModel;
  readonly universe: Universe;
};

const contextFor = (
  model: ResultsViewModel,
  universe: Universe,
): ResultsContext =>
  Match.valueTags(model, {
    Ready: (ready) =>
      ResultsReadyContext.make({
        universe,
        characterId: ready.person.id,
        filmOrder: ready.film.order,
        transport: makeTransportChoice(ready.transport),
      }),
    Missing: () => ResultsMissingContext.make({ universe }),
  });

const ctaEventFor = (
  model: ResultsViewModel,
  universe: Universe,
  cta: ResultsCta,
): CtaClicked =>
  Match.valueTags(model, {
    Ready: (ready) =>
      ResultsReadyCtaClicked.make({
        context: ResultsReadyContext.make({
          universe,
          characterId: ready.person.id,
          filmOrder: ready.film.order,
          transport: makeTransportChoice(ready.transport),
        }),
        cta,
      }),
    Missing: () =>
      ResultsMissingCtaClicked.make({
        context: ResultsMissingContext.make({ universe }),
        cta: "build_another_dossier",
      }),
  });

export const ConnectedResults = ({
  model,
  universe,
}: ConnectedResultsProps) => {
  const emit = useUiEventDispatch();

  useEffect(() => {
    emit(
      PageLoaded.make({
        context: contextFor(model, universe),
      }),
    );
  }, [emit, model, universe]);

  const onCtaClick = (cta: ResultsCta) =>
    emit(ctaEventFor(model, universe, cta));

  return <Results model={model} onCtaClick={onCtaClick} />;
};
