import { FunnelFailures } from "./FunnelView";
import { Universes, TransportKinds } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { luke } from "../domain/FilmUniverse.fixture";
import { makeEn } from "../i18n/I18n.service";
import {
  type PersonCardInput,
  makePersonViewModel,
} from "./PersonCard";
import { makeAppShellViewModel } from "./AppShell";
import {
  FunnelView,
  type FunnelViewModel,
  makeFunnelChooseViewModel,
  makeFunnelFailedViewModel,
  makeFunnelFilmViewModel,
  makeFunnelReviewViewModel,
  makeFunnelSearchViewModel,
  makeFunnelTransportViewModel,
} from "./FunnelView";
import { ConnectedFunnelView } from "./FunnelView.connected";
import { UiEventProvider } from "../ui-events/UiEventContext";

const i18n = makeEn();
const shell = makeAppShellViewModel(i18n, Universes.StarWars);
const person = makePersonViewModel(i18n, luke);
const film = person.films[0];
const transport = person.transports[0];
const illustratedPerson: PersonCardInput = {
  ...luke,
  films: [
    { ...luke.films[0], imageUrl: "https://example.com/poster.jpg" },
    luke.films[1],
  ],
};
const illustratedView = makePersonViewModel(i18n, illustratedPerson);
const choice = { id: "1", name: "Luke Skywalker" };

const render = (model: FunnelViewModel, isPending = false) =>
  renderToStaticMarkup(
    <FunnelView
      model={model}
      dispatch={() => {}}
      isPending={isPending}
      onCtaClick={() => {}}
      onQueryChange={() => {}}
    />,
  );

describe("Funnel", () => {
  it("renders the search step", () => {
    const model = makeFunnelSearchViewModel(i18n, Universes.StarWars, "Luke", undefined);

    expect(model).toMatchObject({
      _tag: "Search",
      stepLabel: "Step 1 of 4",
      query: "Luke",
    });

    const html = render(model);
    expect(html).toContain("Find a character");
    expect(html).toContain("Character name");
    expect(html).toContain("Search");

    const pending = render(model, true);
    expect(pending).toContain("Loading...");
  });

  it("renders the search error", () => {
    const html = render(
      makeFunnelSearchViewModel(i18n, Universes.StarWars, "", "Enter a character name."),
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Enter a character name.");
  });

  it("renders the character choices in the pending state", () => {
    const html = render(
      makeFunnelChooseViewModel(i18n, shell, "Luke", [choice]),
      true,
    );

    expect(html).toContain("Choose a character");
    expect(html).toContain("Luke Skywalker");
    expect(html).toContain("Loading...");
    expect(html).not.toContain("Choose character");

    const idle = render(makeFunnelChooseViewModel(i18n, shell, "Luke", [choice]));
    expect(idle).toContain("Choose character");
  });

  it("renders a film poster in the film choices", () => {
    const html = render(
      makeFunnelFilmViewModel(i18n, shell, illustratedPerson),
    );

    expect(html).toContain("poster.jpg");
  });

  it("renders the film choices", () => {
    const html = render(makeFunnelFilmViewModel(i18n, shell, luke));

    expect(html).toContain("Choose a film");
    expect(html).toContain("A New Hope");
    expect(html).toContain("Next: transport");

    const pending = render(makeFunnelFilmViewModel(i18n, shell, luke), true);
    expect(pending).toContain("Loading...");
  });

  it("renders the transport choices", () => {
    const html = render(
      makeFunnelTransportViewModel(i18n, shell, person, film),
    );

    expect(html).toContain("X-wing");
    expect(html).toContain("Snowspeeder");
    expect(html).toContain(TransportKinds.Starship);
    expect(html).toContain(TransportKinds.Vehicle);
    expect(html).toContain("No transport");
    expect(html).toContain("Review dossier");

    const pending = render(
      makeFunnelTransportViewModel(i18n, shell, person, film),
      true,
    );
    expect(pending).toContain("Loading...");
  });

  it("defaults to no transport when the person has none", () => {
    const barePerson = makePersonViewModel(i18n, {
      ...luke,
      transports: [],
    });
    const html = render(
      makeFunnelTransportViewModel(i18n, shell, barePerson, film),
    );

    expect(html).toContain("No transport");
    expect(html).toContain('value="none"');
  });

  it("renders a known species in the review", () => {
    const speciesPerson = makePersonViewModel(i18n, {
      ...luke,
      species: {
        name: "Human",
        classification: "mammal",
        language: "Galactic Basic",
      },
    });

    const html = render(
      makeFunnelReviewViewModel(
        i18n,
        shell,
        speciesPerson,
        film,
        transport,
      ),
    );

    expect(html).toContain("Human");
  });

  it("renders a film poster in the review", () => {
    const html = render(
      makeFunnelReviewViewModel(
        i18n,
        shell,
        illustratedView,
        illustratedView.films[0],
        transport,
      ),
    );

    expect(html).toContain("poster.jpg");
  });

  it("renders the review with a transport", () => {
    const model = makeFunnelReviewViewModel(
      i18n,
      shell,
      person,
      film,
      transport,
    );

    expect(model.resultsHref).toBe(
      "results?character=1&film=4&transport=starship-12",
    );

    const html = render(model);
    expect(html).toContain("Ready for the dossier");
    expect(html).toContain("Luke Skywalker");
    expect(html).toContain("A New Hope");
    expect(html).toContain("X-wing (Starship)");
    expect(html).toContain("Open dossier");
    expect(html).toContain("Start over");
  });

  it("renders the review without a transport", () => {
    const model = makeFunnelReviewViewModel(i18n, shell, person, film, null);

    expect(model.resultsHref).toContain("transport=none");
    expect(render(model)).toContain("No transport");
  });

  it("renders the failure", () => {
    const html = render(
      makeFunnelFailedViewModel(i18n, shell, FunnelFailures.Unavailable),
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("The dossier could not be built");
    expect(html).toContain("The character API could not answer.");
    expect(html).toContain("Start over");
  });

  it("renders the connected funnel with its initial model", () => {
    const html = renderToStaticMarkup(
      <UiEventProvider handler={() => {}}>
        <ConnectedFunnelView
          model={makeFunnelSearchViewModel(i18n, Universes.StarWars, "", undefined)}
          submitAction={async (previous) => previous}
        />
      </UiEventProvider>,
    );

    expect(html).toContain("Find a character");
  });
});
