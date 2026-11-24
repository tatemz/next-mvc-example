"use client";

import { useActionState } from "react";
import { submitFunnel } from "../../actions/Funnel.serverAction";
import { Funnel, type FunnelViewModel } from "./Funnel";

export const ConnectedFunnel = (model: FunnelViewModel) => {
  const [state, dispatch, isPending] = useActionState(submitFunnel, model);
  return <Funnel {...state} dispatch={dispatch} isPending={isPending} />;
};
