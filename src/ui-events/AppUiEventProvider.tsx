"use client";

import { DateTime, Effect } from "effect";
import type { ReactNode } from "react";
import { beaconUiEventSink } from "./BeaconUiEventSink";
import { consoleUiEventSink } from "./ConsoleUiEventSink";
import { UiEventProvider } from "./UiEventContext";
import { makeUiEventHandler } from "./UiEventHandler";

const handler = makeUiEventHandler(
  [consoleUiEventSink, beaconUiEventSink],
  () => DateTime.formatIso(Effect.runSync(DateTime.now)),
);

export const AppUiEventProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => <UiEventProvider handler={handler}>{children}</UiEventProvider>;
