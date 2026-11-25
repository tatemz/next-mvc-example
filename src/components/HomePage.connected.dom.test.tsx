// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { homeSplash, starWars } from "../../.storybook/pageFixtures";
import { type UiEvent } from "../ui-events/UiEvent";
import { UiEventProvider } from "../ui-events/UiEventContext";
import { ConnectedHomePage } from "./HomePage.connected";

afterEach(cleanup);

describe("ConnectedHomePage events", () => {
  it("emits page load and build-dossier CTA events", async () => {
    const events: UiEvent[] = [];
    render(
      <UiEventProvider handler={(event) => events.push(event)}>
        <ConnectedHomePage model={homeSplash(starWars)} universe="star-wars" />
      </UiEventProvider>,
    );
    const link = screen.getByRole("link", { name: "Build a dossier" });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "PageLoaded",
          context: { _tag: "Home", universe: "star-wars" },
        }),
      ),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "HomeCtaClicked",
        context: { _tag: "Home", universe: "star-wars" },
        cta: "build_dossier",
      }),
    );
  });
});
