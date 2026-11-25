import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { luke } from "../../domain/FilmUniverse.fixture";
import { makeEn } from "../../i18n/I18n.service";
import { makePersonViewModel } from "../PersonCard/PersonCard";
import {
  Funnel,
  type FunnelViewModel,
  makeFunnelChooseViewModel,
  makeFunnelFailedViewModel,
  makeFunnelFilmViewModel,
  makeFunnelReviewViewModel,
  makeFunnelSearchViewModel,
  makeFunnelTransportViewModel,
  PersonChoiceViewModel,
} from "./Funnel";
import { ConnectedFunnel } from "./Funnel.connected";

const i18n = makeEn();
const person = makePersonViewModel(i18n, luke);
const film = person.films[0];
const transport = person.transports[0];
const choice = PersonChoiceViewModel.make({
  id: "1",
  name: "Luke Skywalker",
});

const render = (model: FunnelViewModel, isPending = false) =>
  renderToStaticMarkup(
    <Funnel {...model} dispatch={() => {}} isPending={isPending} />,
  );

describe("Funnel", () => {
  it("renders the search step", () => {
    const model = makeFunnelSearchViewModel(i18n, "Luke");

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
      makeFunnelSearchViewModel(i18n, "", "Enter a character name."),
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Enter a character name.");
  });

  it("renders the character choices in the pending state", () => {
    const html = render(
      makeFunnelChooseViewModel(i18n, "Luke", [choice]),
      true,
    );

    expect(html).toContain("Choose a character");
    expect(html).toContain("Luke Skywalker");
    expect(html).toContain("Loading...");
    expect(html).not.toContain("Choose character");

    const idle = render(makeFunnelChooseViewModel(i18n, "Luke", [choice]));
    expect(idle).toContain("Choose character");
  });

  it("renders the film choices", () => {
    const html = render(makeFunnelFilmViewModel(i18n, person));

    expect(html).toContain("Choose a film");
    expect(html).toContain("A New Hope");
    expect(html).toContain("Next: transport");

    const pending = render(makeFunnelFilmViewModel(i18n, person), true);
    expect(pending).toContain("Loading...");
  });

  it("renders the transport choices", () => {
    const html = render(
      makeFunnelTransportViewModel(i18n, person, film),
    );

    expect(html).toContain("X-wing");
    expect(html).toContain("Snowspeeder");
    expect(html).toContain("Starship");
    expect(html).toContain("Vehicle");
    expect(html).toContain("No transport");
    expect(html).toContain("Review dossier");

    const pending = render(
      makeFunnelTransportViewModel(i18n, person, film),
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
      makeFunnelTransportViewModel(i18n, barePerson, film),
    );

    expect(html).toContain("No transport");
    expect(html).toContain('value="none"');
  });

  it("renders the review with a transport", () => {
    const model = makeFunnelReviewViewModel(
      i18n,
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
    const model = makeFunnelReviewViewModel(i18n, person, film, null);

    expect(model.resultsHref).toContain("transport=none");
    expect(render(model)).toContain("No transport");
  });

  it("renders the failure", () => {
    const html = render(
      makeFunnelFailedViewModel(
        i18n,
        "The Star Wars API could not answer.",
      ),
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("The dossier could not be built");
    expect(html).toContain("The Star Wars API could not answer.");
    expect(html).toContain("Start over");
  });

  it("renders the connected funnel with its initial model", () => {
    const html = renderToStaticMarkup(
      <ConnectedFunnel
        model={makeFunnelSearchViewModel(i18n)}
        submitAction={async (previous) => previous}
      />,
    );

    expect(html).toContain("Find a character");
  });
});
