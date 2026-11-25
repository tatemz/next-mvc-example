import type { UiEventSink } from "./UiEventHandler";

export const consoleUiEventSink: UiEventSink = (payload) => {
  console.info("ui event", payload);
};
