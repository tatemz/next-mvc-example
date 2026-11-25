"use client";

import { useEffect, useActionState } from "react";
import {
  CtaClicked,
  FormValidationError,
  InputFilled,
  PageContext,
  PageLoaded,
  makeTransportChoice,
  type FunnelContext,
  type FunnelCta,
  type Universe,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import { FunnelView, FunnelViewModel } from "./FunnelView";

type FunnelAction = (
  previous: FunnelViewModel,
  formData: FormData,
) => Promise<FunnelViewModel>;

export type ConnectedFunnelViewProps = {
  readonly model: FunnelViewModel;
  readonly submitAction: FunnelAction;
  readonly universe: Universe;
};

const contextFor = (
  model: FunnelViewModel,
  universe: Universe,
): FunnelContext =>
  FunnelViewModel.match(model, {
    Search: () =>
      PageContext.cases.FunnelSearch.make({ universe }),
    Choose: (step) =>
      PageContext.cases.FunnelChoose.make({
        universe,
        query: step.query,
      }),
    Film: (step) =>
      PageContext.cases.FunnelFilm.make({
        universe,
        characterId: step.person.id,
      }),
    Transport: (step) =>
      PageContext.cases.FunnelTransport.make({
        universe,
        characterId: step.person.id,
        filmOrder: step.film.order,
      }),
    Review: (step) =>
      PageContext.cases.FunnelReview.make({
        universe,
        characterId: step.person.id,
        filmOrder: step.film.order,
        transport: makeTransportChoice(step.transport),
      }),
    Failed: () =>
      PageContext.cases.FunnelFailed.make({ universe }),
  });

const ctaEventFor = (
  model: FunnelViewModel,
  universe: Universe,
  cta: FunnelCta,
): CtaClicked =>
  FunnelViewModel.match(model, {
    Search: () =>
      CtaClicked.cases.FunnelSearchCtaClicked.make({
        context: PageContext.cases.FunnelSearch.make({
          universe,
        }),
        cta: "search",
      }),
    Choose: (step) =>
      CtaClicked.cases.FunnelChooseCtaClicked.make({
        context: PageContext.cases.FunnelChoose.make({
          universe,
          query: step.query,
        }),
        cta: "choose_character",
      }),
    Film: (step) =>
      CtaClicked.cases.FunnelFilmCtaClicked.make({
        context: PageContext.cases.FunnelFilm.make({
          universe,
          characterId: step.person.id,
        }),
        cta: "next_transport",
      }),
    Transport: (step) =>
      CtaClicked.cases.FunnelTransportCtaClicked.make({
        context: PageContext.cases.FunnelTransport.make({
          universe,
          characterId: step.person.id,
          filmOrder: step.film.order,
        }),
        cta: "review_dossier",
      }),
    Review: (step) =>
      CtaClicked.cases.FunnelReviewCtaClicked.make({
        context: PageContext.cases.FunnelReview.make({
          universe,
          characterId: step.person.id,
          filmOrder: step.film.order,
          transport: makeTransportChoice(step.transport),
        }),
        cta: cta === "start_over" ? "start_over" : "open_dossier",
      }),
    Failed: () =>
      CtaClicked.cases.FunnelFailedCtaClicked.make({
        context: PageContext.cases.FunnelFailed.make({
          universe,
        }),
        cta: "start_over",
      }),
  });

export const ConnectedFunnelView = ({
  model,
  submitAction,
  universe,
}: ConnectedFunnelViewProps) => {
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
    <FunnelView
      model={state}
      dispatch={dispatch}
      isPending={isPending}
      onCtaClick={onCtaClick}
      onQueryChange={onQueryChange}
    />
  );
};
