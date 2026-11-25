"use client";

import { useActionState } from "react";
import { Funnel, type FunnelViewModel } from "./Funnel";

export type FunnelAction = (
  previous: FunnelViewModel,
  formData: FormData,
) => Promise<FunnelViewModel>;

export type ConnectedFunnelProps = {
  readonly model: FunnelViewModel;
  readonly submitAction: FunnelAction;
};

export const ConnectedFunnel = ({
  model,
  submitAction,
}: ConnectedFunnelProps) => {
  const [state, dispatch, isPending] = useActionState(submitAction, model);
  return <Funnel {...state} dispatch={dispatch} isPending={isPending} />;
};
