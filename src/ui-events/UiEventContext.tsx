"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import type { UiEventHandler } from "./UiEventHandler";

const UiEventContext = createContext<UiEventHandler | null>(null);

export type UiEventProviderProps = PropsWithChildren<{
  readonly handler: UiEventHandler;
}>;

export const UiEventProvider = ({
  children,
  handler,
}: UiEventProviderProps) => (
  <UiEventContext.Provider value={handler}>
    {children}
  </UiEventContext.Provider>
);

export const useUiEventDispatch = (): UiEventHandler => {
  const handler = useContext(UiEventContext);
  if (handler === null) {
    throw new Error("UiEventProvider is required.");
  }
  return handler;
};
