// @vitest-environment jsdom

import { Universes } from "../domain/FilmUniverse.model";
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
import { type UiEvent, FunnelCtas } from "../ui-events/UiEvent";
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

    const input = screen.getByLabelText("Character name");
    fireEvent.change(input, { target: { value: "Leia" } });
    fireEvent.change(input, { target: { value: "Leia Organa" } });

    expect(
      events.filter((event) => event._tag === "InputFilled"),
    ).toEqual([]);

    fireEvent.blur(input);

    expect(
      events.filter((event) => event._tag === "InputFilled"),
    ).toEqual([
      expect.objectContaining({
        _tag: "InputFilled",
        universe: Universes.StarWars,
        field: "funnel_query",
        value: "Leia Organa",
      }),
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "PageLoaded",
          context: {
            _tag: "FunnelSearch",
            universe: Universes.StarWars,
          },
        }),
      ),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelSearchCtaClicked",
        context: {
          _tag: "FunnelSearch",
          universe: Universes.StarWars,
        },
        cta: FunnelCtas.Search,
      }),
    );
  });

  it("emits the search validation error", async () => {
    const events = renderFunnel(funnelSearchWithError(starWars));

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "FormValidationError",
          universe: Universes.StarWars,
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
          universe: Universes.StarWars,
          query: "Luke",
        },
        cta: FunnelCtas.ChooseCharacter,
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
          universe: Universes.StarWars,
          characterId: "1",
        },
        cta: FunnelCtas.NextTransport,
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
          universe: Universes.StarWars,
          characterId: "1",
          filmOrder: 4,
        },
        cta: FunnelCtas.ReviewDossier,
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
          universe: Universes.StarWars,
          characterId: "1",
          filmOrder: 4,
          transport: {
            _tag: "TransportChosen",
            key: "starship-12",
          },
        },
        cta: FunnelCtas.OpenDossier,
      }),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "FunnelReviewCtaClicked",
        context: {
          _tag: "FunnelReview",
          universe: Universes.StarWars,
          characterId: "1",
          filmOrder: 4,
          transport: {
            _tag: "TransportChosen",
            key: "starship-12",
          },
        },
        cta: FunnelCtas.StartOver,
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
          universe: Universes.Ghibli,
          characterId: "1",
          transport: { _tag: "NoTransport" },
        }),
        cta: FunnelCtas.OpenDossier,
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
          universe: Universes.StarWars,
        },
        cta: FunnelCtas.StartOver,
      }),
    );
  });
});
