// @vitest-environment jsdom

import { Universes } from "../domain/FilmUniverse.model";
import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { homeSplash, starWars } from "../../.storybook/pageFixtures";
import { type UiEvent, HomeCtas } from "../ui-events/UiEvent";
import { UiEventProvider } from "../ui-events/UiEventContext";
import { ConnectedHomeView } from "./HomeView.connected";

afterEach(cleanup);

describe("ConnectedHomeView events", () => {
  it("emits page load and build-dossier CTA events", async () => {
    const events: UiEvent[] = [];
    render(
      <UiEventProvider handler={(event) => events.push(event)}>
        <ConnectedHomeView model={homeSplash(starWars)} />
      </UiEventProvider>,
    );
    const link = screen.getByRole("link", { name: "Build a dossier" });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);

    await waitFor(() =>
      expect(events).toContainEqual(
        expect.objectContaining({
          _tag: "PageLoaded",
          context: { _tag: "Home", universe: Universes.StarWars },
        }),
      ),
    );
    expect(events).toContainEqual(
      expect.objectContaining({
        _tag: "HomeCtaClicked",
        context: { _tag: "Home", universe: Universes.StarWars },
        cta: HomeCtas.BuildDossier,
      }),
    );
  });
});
