// @vitest-environment jsdom

import { Universes } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, vi } from "vitest";
import { AppUiEventProvider } from "./AppUiEventProvider";
import { UI_EVENT_ROUTE } from "./BeaconUiEventSink";
import { PageContext, PageLoaded } from "./UiEvent";
import { useUiEventDispatch } from "./UiEventContext";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const Trigger = () => {
  const emit = useUiEventDispatch();
  return (
    <button
      onClick={() =>
        emit(
          PageLoaded.make({
            context: PageContext.cases.FunnelChoose.make({
              universe: Universes.Ghibli,
              query: "Leia",
            }),
          }),
        )
      }
    >
      emit
    </button>
  );
};

describe("AppUiEventProvider", () => {
  it("sends the payload to the console and the beacon route", async () => {
    const sendBeacon = vi.fn((_url: string, _body: Blob) => true);
    vi.stubGlobal("navigator", { sendBeacon });
    const info = vi.spyOn(console, "info").mockImplementation(() => {});

    render(
      <AppUiEventProvider>
        <Trigger />
      </AppUiEventProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "emit" }));

    expect(info).toHaveBeenCalledTimes(1);
    const logged = info.mock.calls[0]?.[1];
    expect(logged).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      universe: Universes.Ghibli,
      properties: { query: "Leia" },
    });

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const call = sendBeacon.mock.calls[0];
    if (call === undefined) {
      throw new Error("expected a beacon call");
    }
    const [url, body] = call;
    expect(url).toBe(UI_EVENT_ROUTE);
    expect(await body.text()).toBe(JSON.stringify(logged));
  });
});
