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
import { ConnectedResultsView } from "./ResultsView.connected";

afterEach(cleanup);

const renderResults = (model: ReturnType<typeof resultsReady>) => {
  const events: UiEvent[] = [];
  render(
    <UiEventProvider handler={(event) => events.push(event)}>
      <ConnectedResultsView model={model} universe="star-wars" />
    </UiEventProvider>,
  );
  return events;
};

const preventNavigation = (element: HTMLElement) =>
  element.addEventListener("click", (event) => event.preventDefault());

describe("ConnectedResultsView events", () => {
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
          context: {
            _tag: "ResultsReady",
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
            transport: {
              _tag: "TransportChosen",
              key: "starship-12",
            },
          },
        }),
      ),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "ResultsReadyCtaClicked",
        context: {
          _tag: "ResultsReady",
          universe: "star-wars",
          characterId: "1",
          filmOrder: 4,
          transport: {
            _tag: "TransportChosen",
            key: "starship-12",
          },
        },
        cta: "build_another_dossier",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "ResultsReadyCtaClicked",
        context: {
          _tag: "ResultsReady",
          universe: "star-wars",
          characterId: "1",
          filmOrder: 4,
          transport: {
            _tag: "TransportChosen",
            key: "starship-12",
          },
        },
        cta: "back_home",
      }),
    );
  });

  it("emits page load without a transport", () => {
    const events = renderResults(resultsReady(starWars, null));

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "PageLoaded",
        context: {
          _tag: "ResultsReady",
          universe: "star-wars",
          characterId: "1",
          filmOrder: 4,
          transport: { _tag: "NoTransport" },
        },
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
        context: {
          _tag: "ResultsMissing",
          universe: "star-wars",
        },
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "ResultsMissingCtaClicked",
        context: {
          _tag: "ResultsMissing",
          universe: "star-wars",
        },
        cta: "build_another_dossier",
      }),
    );
  });
});
