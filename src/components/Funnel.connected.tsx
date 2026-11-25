"use client";

import { Match } from "effect";
import { useEffect, useActionState } from "react";
import {
  CtaClicked,
  FormValidationError,
  InputFilled,
  PageLoaded,
  type Universe,
} from "../ui-events/UiEvent";
import { useUiEventDispatch } from "../ui-events/UiEventContext";
import {
  Funnel,
  type FunnelCta,
  type FunnelViewModel,
} from "./Funnel";

type FunnelAction = (
  previous: FunnelViewModel,
  formData: FormData,
) => Promise<FunnelViewModel>;

export type ConnectedFunnelProps = {
  readonly model: FunnelViewModel;
  readonly submitAction: FunnelAction;
  readonly universe: Universe;
};

const metadataFor = (model: FunnelViewModel) =>
  Match.valueTags(model, {
    Search: () => ({}),
    Choose: (step) => ({ query: step.query }),
    Film: (step) => ({ characterId: step.person.id }),
    Transport: (step) => ({
      characterId: step.person.id,
      filmOrder: step.film.order,
    }),
    Review: (step) => ({
      characterId: step.person.id,
      filmOrder: step.film.order,
      ...(step.transport === null
        ? {}
        : { transportKey: step.transport.key }),
    }),
    Failed: () => ({}),
  });

export const ConnectedFunnel = ({
  model,
  submitAction,
  universe,
}: ConnectedFunnelProps) => {
  const emit = useUiEventDispatch();
  const [state, dispatch, isPending] = useActionState(submitAction, model);

  useEffect(() => {
    emit(PageLoaded.make({ page: "funnel", universe }));
  }, [emit, universe]);

  useEffect(() => {
    if (state._tag === "Search" && state.error !== undefined) {
      emit(
        FormValidationError.make({
          page: "funnel",
          universe,
          form: "funnel_search",
          message: state.error,
          query: state.query,
        }),
      );
    }
  }, [emit, state, universe]);

  const onCtaClick = (cta: FunnelCta) =>
    emit(
      CtaClicked.make({
        page: "funnel",
        universe,
        cta,
        ...metadataFor(state),
      }),
    );

  const onQueryChange = (value: string) =>
    emit(
      InputFilled.make({
        page: "funnel",
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
