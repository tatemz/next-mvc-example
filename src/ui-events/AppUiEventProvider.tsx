"use client";

import { DateTime, Effect } from "effect";
import type { ReactNode } from "react";
import { browserUiEventSink } from "./BrowserUiEventSink";
import { UiEventProvider } from "./UiEventContext";
import { makeUiEventHandler } from "./UiEventHandler";

const handler = makeUiEventHandler(
  browserUiEventSink,
  () => DateTime.formatIso(Effect.runSync(DateTime.now)),
);

export const AppUiEventProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => <UiEventProvider handler={handler}>{children}</UiEventProvider>;
