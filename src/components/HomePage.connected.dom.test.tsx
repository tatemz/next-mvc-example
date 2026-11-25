// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  homeFailed,
  homeLoaded,
  homeLoadedWithError,
  starWars,
} from "../../.storybook/pageFixtures";
import { type UiEvent } from "../ui-events/UiEvent";
import { UiEventProvider } from "../ui-events/UiEventContext";
import type { HomePageViewModel } from "./HomePage";
import { ConnectedHomePage } from "./HomePage.connected";

afterEach(cleanup);

const action = async (previous: HomePageViewModel) => previous;

const recorder = () => {
  const events: UiEvent[] = [];
  return {
    events,
    handler: (event: UiEvent) => events.push(event),
  };
};

const renderHome = (model: HomePageViewModel) => {
  const { events, handler } = recorder();
  render(
    <UiEventProvider handler={handler}>
      <ConnectedHomePage
        model={model}
        searchAction={action}
        universe="star-wars"
      />
    </UiEventProvider>,
  );
  return events;
};

const preventNavigation = (element: HTMLElement) =>
  element.addEventListener("click", (event) => event.preventDefault());

describe("ConnectedHomePage events", () => {
  it("emits page load, input, and CTA events", async () => {
    const events = renderHome(homeLoaded(starWars));
    const link = screen.getByRole("link", { name: "Build a dossier" });
    preventNavigation(link);

    fireEvent.change(screen.getByLabelText("Character id"), {
      target: { value: "3" },
    });
    fireEvent.click(link);
    fireEvent.click(screen.getByRole("button", { name: "Load character" }));

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "PageLoaded",
          page: "home",
          universe: "star-wars",
          characterId: "1",
        }),
      ),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "InputFilled",
        field: "characterId",
        value: "3",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "CtaClicked",
        cta: "build_dossier",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "CtaClicked",
        cta: "load_character",
      }),
    );
  });

  it("emits a validation error from the model", async () => {
    const events = renderHome(homeLoadedWithError(starWars));

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "FormValidationError",
          page: "home",
          form: "home_search",
        }),
      ),
    );
  });

  it("emits page load and CTA events from the failed page", () => {
    const events = renderHome(homeFailed(starWars, "abc"));
    const link = screen.getByRole("link", { name: "Build a dossier" });
    preventNavigation(link);

    fireEvent.click(link);

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "PageLoaded",
        page: "home",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "CtaClicked",
        cta: "build_dossier",
      }),
    );
  });
});
