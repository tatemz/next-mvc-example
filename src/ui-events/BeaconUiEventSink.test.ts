// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { UI_EVENT_ROUTE, beaconUiEventSink } from "./BeaconUiEventSink";
import type { UiEventPayload } from "./UiEventHandler";

const payload: UiEventPayload = {
  event: "page_loaded",
  page: "home",
  universe: "star-wars",
  occurredAt: "2026-11-24T12:00:00.000Z",
  properties: {},
};

afterEach(() => vi.unstubAllGlobals());

describe("beaconUiEventSink", () => {
  it("sends the payload as JSON to the UI event route", async () => {
    const sendBeacon = vi.fn((_url: string, _body: Blob) => true);
    vi.stubGlobal("navigator", { sendBeacon });

    beaconUiEventSink(payload);

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const call = sendBeacon.mock.calls[0];
    if (call === undefined) {
      throw new Error("expected a beacon call");
    }
    const [url, body] = call;
    expect(url).toBe(UI_EVENT_ROUTE);
    expect(body).toBeInstanceOf(Blob);
    expect(await body.text()).toBe(JSON.stringify(payload));
  });
});
