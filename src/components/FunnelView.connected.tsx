"use client";

import { Match } from "effect";
import { useEffect, useActionState } from "react";
import {
  CtaClicked,
  FormValidationError,
  FunnelCtas,
  InputFilled,
  PageContext,
  PageLoaded,
  makeTransportChoice,
  type FunnelContext,
  type FunnelCta,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import type { Universe } from "../domain/FilmUniverse.model";
import { FunnelView, FunnelViewModel } from "./FunnelView";

type FunnelAction = (
  previous: FunnelViewModel,
  formData: FormData,
) => Promise<FunnelViewModel>;

export type ConnectedFunnelViewProps = {
  readonly model: FunnelViewModel;
  readonly submitAction: FunnelAction;
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
        cta: FunnelCtas.Search,
      }),
    Choose: (step) =>
      CtaClicked.cases.FunnelChooseCtaClicked.make({
        context: PageContext.cases.FunnelChoose.make({
          universe,
          query: step.query,
        }),
        cta: FunnelCtas.ChooseCharacter,
      }),
    Film: (step) =>
      CtaClicked.cases.FunnelFilmCtaClicked.make({
        context: PageContext.cases.FunnelFilm.make({
          universe,
          characterId: step.person.id,
        }),
        cta: FunnelCtas.NextTransport,
      }),
    Transport: (step) =>
      CtaClicked.cases.FunnelTransportCtaClicked.make({
        context: PageContext.cases.FunnelTransport.make({
          universe,
          characterId: step.person.id,
          filmOrder: step.film.order,
        }),
        cta: FunnelCtas.ReviewDossier,
      }),
    Review: (step) =>
      CtaClicked.cases.FunnelReviewCtaClicked.make({
        context: PageContext.cases.FunnelReview.make({
          universe,
          characterId: step.person.id,
          filmOrder: step.film.order,
          transport: makeTransportChoice(step.transport),
        }),
        cta: cta === FunnelCtas.StartOver
          ? FunnelCtas.StartOver
          : FunnelCtas.OpenDossier,
      }),
    Failed: () =>
      CtaClicked.cases.FunnelFailedCtaClicked.make({
        context: PageContext.cases.FunnelFailed.make({
          universe,
        }),
        cta: FunnelCtas.StartOver,
      }),
  });

export const ConnectedFunnelView = ({
  model,
  submitAction,
}: ConnectedFunnelViewProps) => {
  const universe = model.shell.universe;
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
    const validation = Match.valueTags(state, {
      Search: (search) =>
        search.error === undefined
          ? undefined
          : { query: search.query, message: search.error },
      Choose: () => undefined,
      Film: () => undefined,
      Transport: () => undefined,
      Review: () => undefined,
      Failed: () => undefined,
    });

    if (validation !== undefined) {
      emit(
        FormValidationError.make({
          universe,
          form: "funnel_search",
          query: validation.query,
          message: validation.message,
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
