// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  funnelChoose,
  funnelFailed,
  funnelFilm,
  funnelReview,
  funnelSearch,
  funnelSearchWithError,
  funnelTransport,
  ghibli,
  starWars,
} from "../../.storybook/pageFixtures";
import { type UiEvent } from "../ui-events/UiEvent";
import { UiEventProvider } from "../ui-events/UiEventContext";
import type { FunnelViewModel } from "./FunnelView";
import { ConnectedFunnelView } from "./FunnelView.connected";

afterEach(cleanup);

const action = async (previous: FunnelViewModel) => previous;

const renderFunnel = (model: FunnelViewModel) => {
  const events: UiEvent[] = [];
  render(
    <UiEventProvider handler={(event) => events.push(event)}>
      <ConnectedFunnelView model={model} submitAction={action} />
    </UiEventProvider>,
  );
  return events;
};

const preventNavigation = (element: HTMLElement) =>
  element.addEventListener("click", (event) => event.preventDefault());

describe("ConnectedFunnelView events", () => {
  it("emits page load, input, and search CTA events", async () => {
    const events = renderFunnel(funnelSearch(starWars));

    fireEvent.change(screen.getByLabelText("Character name"), {
      target: { value: "Leia" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "PageLoaded",
          context: {
            _tag: "FunnelSearch",
            universe: "star-wars",
          },
        }),
      ),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "InputFilled",
        universe: "star-wars",
        field: "funnel_query",
        value: "Leia",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelSearchCtaClicked",
        context: {
          _tag: "FunnelSearch",
          universe: "star-wars",
        },
        cta: "search",
      }),
    );
  });

  it("emits the search validation error", async () => {
    const events = renderFunnel(funnelSearchWithError(starWars));

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "FormValidationError",
          universe: "star-wars",
          form: "funnel_search",
          query: "",
        }),
      ),
    );
  });

  it("emits the character choice CTA", () => {
    const events = renderFunnel(funnelChoose(starWars, "Leia Organa"));

    fireEvent.click(screen.getByRole("radio", { name: "Luke Skywalker" }));
    fireEvent.click(screen.getByRole("button", { name: "Choose character" }));

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelChooseCtaClicked",
        context: {
          _tag: "FunnelChoose",
          universe: "star-wars",
          query: "Luke",
        },
        cta: "choose_character",
      }),
    );
  });

  it("emits the film CTA", () => {
    const events = renderFunnel(funnelFilm(starWars));

    fireEvent.click(screen.getByRole("radio", { name: "A New Hope" }));
    fireEvent.click(screen.getByRole("button", { name: "Next: transport" }));

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelFilmCtaClicked",
        context: {
          _tag: "FunnelFilm",
          universe: "star-wars",
          characterId: "1",
        },
        cta: "next_transport",
      }),
    );
  });

  it("emits the transport CTA", () => {
    const events = renderFunnel(funnelTransport(starWars));

    fireEvent.click(screen.getByRole("radio", { name: /X-wing/ }));
    fireEvent.click(screen.getByRole("button", { name: "Review dossier" }));

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelTransportCtaClicked",
        context: {
          _tag: "FunnelTransport",
          universe: "star-wars",
          characterId: "1",
          filmOrder: 4,
        },
        cta: "review_dossier",
      }),
    );
  });

  it("emits the review and start-over CTAs", () => {
    const events = renderFunnel(funnelReview(starWars, starWars.transport));
    const open = screen.getByRole("link", { name: "Open dossier" });
    const startOver = screen.getByRole("link", { name: "Start over" });
    preventNavigation(open);
    preventNavigation(startOver);

    fireEvent.click(open);
    fireEvent.click(startOver);

    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelReviewCtaClicked",
        context: {
          _tag: "FunnelReview",
          universe: "star-wars",
          characterId: "1",
          filmOrder: 4,
          transport: {
            _tag: "TransportChosen",
            key: "starship-12",
          },
        },
        cta: "open_dossier",
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelReviewCtaClicked",
        context: {
          _tag: "FunnelReview",
          universe: "star-wars",
          characterId: "1",
          filmOrder: 4,
          transport: {
            _tag: "TransportChosen",
            key: "starship-12",
          },
        },
        cta: "start_over",
      }),
    );
  });

  it("emits review and failed CTAs without a transport", () => {
    const reviewEvents = renderFunnel(funnelReview(ghibli, null));
    const open = screen.getByRole("link", { name: "Open dossier" });
    preventNavigation(open);
    fireEvent.click(open);
    expect(reviewEvents).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelReviewCtaClicked",
        context: expect.objectContaining({
          _tag: "FunnelReview",
          universe: "ghibli",
          characterId: "1",
          transport: { _tag: "NoTransport" },
        }),
        cta: "open_dossier",
      }),
    );

    cleanup();
    const failedEvents = renderFunnel(funnelFailed(starWars));
    const startOver = screen.getByRole("link", { name: "Start over" });
    preventNavigation(startOver);
    fireEvent.click(startOver);
    expect(failedEvents).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelFailedCtaClicked",
        context: {
          _tag: "FunnelFailed",
          universe: "star-wars",
        },
        cta: "start_over",
      }),
    );
  });
});
