import type { UiEventSink } from "./UiEventHandler";

export const UI_EVENT_NAME = "ui-event";

export const browserUiEventSink: UiEventSink = (payload) => {
  window.dispatchEvent(new CustomEvent(UI_EVENT_NAME, { detail: payload }));
};
