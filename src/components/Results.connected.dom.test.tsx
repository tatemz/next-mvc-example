// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  resultsMissing,
  resultsReady,
  starWars,
} from "../../.storybook/pageFixtures";
import { type UiEvent } from "../ui-events/UiEvent";
import { UiEventProvider } from "../ui-events/UiEventContext";
import { ConnectedResults } from "./Results.connected";

afterEach(cleanup);

const renderResults = (model: ReturnType<typeof resultsReady>) => {
  const events: UiEvent[] = [];
  render(
    <UiEventProvider handler={(event) => events.push(event)}>
      <ConnectedResults model={model} universe="star-wars" />
    </UiEventProvider>,
  );
  return events;
};

const preventNavigation = (element: HTMLElement) =>
  element.addEventListener("click", (event) => event.preventDefault());

describe("ConnectedResults events", () => {
  it("emits page load and result CTAs", async () => {
    const events = renderResults(
      resultsReady(starWars, starWars.transport),
    );
    const startOver = screen.getByRole("link", {
      name: "Build another dossier",
    });
    const home = screen.getByRole("link", { name: "Back home" });
    preventNavigation(startOver);
    preventNavigation(home);

    fireEvent.click(startOver);
    fireEvent.click(home);

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "PageLoaded",
          page: "results",
          characterId: "1",
          filmOrder: 4,
          transportKey: "starship-12",
        }),
      ),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "CtaClicked",
        cta: "build_another_dossier",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "CtaClicked",
        cta: "back_home",
      }),
    );
  });

  it("emits page load without a transport", () => {
    const events = renderResults(resultsReady(starWars, null));

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "PageLoaded",
        page: "results",
        characterId: "1",
        filmOrder: 4,
      }),
    );
  });

  it("emits page load and restart from the missing state", () => {
    const events = renderResults(resultsMissing(starWars));
    const startOver = screen.getByRole("link", { name: "Build a dossier" });
    preventNavigation(startOver);

    fireEvent.click(startOver);

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "PageLoaded",
        page: "results",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "CtaClicked",
        cta: "build_another_dossier",
      }),
    );
  });
});
