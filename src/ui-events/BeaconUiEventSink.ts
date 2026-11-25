import type { UiEventSink } from "./UiEventHandler";

export const UI_EVENT_ROUTE = "/api/ui-events";

export const beaconUiEventSink: UiEventSink = (payload) => {
  navigator.sendBeacon(
    UI_EVENT_ROUTE,
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );
};
