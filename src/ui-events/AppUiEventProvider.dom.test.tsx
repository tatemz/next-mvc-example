// @vitest-environment jsdom

import { it } from "@effect/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import { AppUiEventProvider } from "./AppUiEventProvider";
import { UI_EVENT_NAME } from "./BrowserUiEventSink";
import { FunnelChooseContext, PageLoaded } from "./UiEvent";
import { useUiEventDispatch } from "./UiEventContext";

const Trigger = () => {
  const emit = useUiEventDispatch();
  return (
    <button
      onClick={() =>
        emit(
          PageLoaded.make({
            context: FunnelChooseContext.make({
              universe: "ghibli",
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
  it("sends transformed events through the browser sink", () => {
    const listener = vi.fn();
    window.addEventListener(UI_EVENT_NAME, listener);

    render(
      <AppUiEventProvider>
        <Trigger />
      </AppUiEventProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "emit" }));

    expect(listener).toHaveBeenCalledTimes(1);
    const browserEvent = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(browserEvent.detail).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      universe: "ghibli",
      properties: { query: "Leia" },
    });

    window.removeEventListener(UI_EVENT_NAME, listener);
  });
});
