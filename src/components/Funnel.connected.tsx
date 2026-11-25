"use client";

import { Match } from "effect";
import { useEffect, useActionState } from "react";
import {
  FunnelChooseContext,
  FunnelChooseCtaClicked,
  FunnelFailedContext,
  FunnelFailedCtaClicked,
  FunnelFilmContext,
  FunnelFilmCtaClicked,
  FunnelReviewContext,
  FunnelReviewCtaClicked,
  FunnelSearchContext,
  FunnelSearchCtaClicked,
  FunnelTransportContext,
  FunnelTransportCtaClicked,
  FormValidationError,
  InputFilled,
  PageLoaded,
  makeTransportChoice,
  type CtaClicked,
  type FunnelContext,
  type FunnelCta,
  type Universe,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { Funnel, type FunnelViewModel } from "./Funnel";

type FunnelAction = (
  previous: FunnelViewModel,
  formData: FormData,
) => Promise<FunnelViewModel>;

export type ConnectedFunnelProps = {
  readonly model: FunnelViewModel;
  readonly submitAction: FunnelAction;
  readonly universe: Universe;
};

const contextFor = (
  model: FunnelViewModel,
  universe: Universe,
): FunnelContext =>
  Match.valueTags(model, {
    Search: () => FunnelSearchContext.make({ universe }),
    Choose: (step) =>
      FunnelChooseContext.make({ universe, query: step.query }),
    Film: (step) =>
      FunnelFilmContext.make({
        universe,
        characterId: step.person.id,
      }),
    Transport: (step) =>
      FunnelTransportContext.make({
        universe,
        characterId: step.person.id,
        filmOrder: step.film.order,
      }),
    Review: (step) =>
      FunnelReviewContext.make({
        universe,
        characterId: step.person.id,
        filmOrder: step.film.order,
        transport: makeTransportChoice(step.transport),
      }),
    Failed: () => FunnelFailedContext.make({ universe }),
  });

const ctaEventFor = (
  model: FunnelViewModel,
  universe: Universe,
  cta: FunnelCta,
): CtaClicked =>
  Match.valueTags(model, {
    Search: () =>
      FunnelSearchCtaClicked.make({
        context: FunnelSearchContext.make({ universe }),
        cta: "search",
      }),
    Choose: (step) =>
      FunnelChooseCtaClicked.make({
        context: FunnelChooseContext.make({
          universe,
          query: step.query,
        }),
        cta: "choose_character",
      }),
    Film: (step) =>
      FunnelFilmCtaClicked.make({
        context: FunnelFilmContext.make({
          universe,
          characterId: step.person.id,
        }),
        cta: "next_transport",
      }),
    Transport: (step) =>
      FunnelTransportCtaClicked.make({
        context: FunnelTransportContext.make({
          universe,
          characterId: step.person.id,
          filmOrder: step.film.order,
        }),
        cta: "review_dossier",
      }),
    Review: (step) =>
      FunnelReviewCtaClicked.make({
        context: FunnelReviewContext.make({
          universe,
          characterId: step.person.id,
          filmOrder: step.film.order,
          transport: makeTransportChoice(step.transport),
        }),
        cta: cta === "start_over" ? "start_over" : "open_dossier",
      }),
    Failed: () =>
      FunnelFailedCtaClicked.make({
        context: FunnelFailedContext.make({ universe }),
        cta: "start_over",
      }),
  });

export const ConnectedFunnel = ({
  model,
  submitAction,
  universe,
}: ConnectedFunnelProps) => {
  const emit = useUiEventDispatch();
  const [state, dispatch, isPending] = useActionState(submitAction, model);

  useEffect(() => {
    emit(
      PageLoaded.make({
        context: contextFor(model, universe),
      }),
    );
  }, [emit, model, universe]);

  useEffect(() => {
    if (state._tag === "Search" && state.error !== undefined) {
      emit(
        FormValidationError.make({
          universe,
          form: "funnel_search",
          query: state.query,
          message: state.error,
        }),
      );
    }
  }, [emit, state, universe]);

  const onCtaClick = (cta: FunnelCta) =>
    emit(ctaEventFor(state, universe, cta));

  const onQueryChange = (value: string) =>
    emit(
      InputFilled.make({
        universe,
        field: "funnel_query",
        value,
      }),
    );

  return (
    <Funnel
      {...state}
      dispatch={dispatch}
      isPending={isPending}
      onCtaClick={onCtaClick}
      onQueryChange={onQueryChange}
    />
  );
};
