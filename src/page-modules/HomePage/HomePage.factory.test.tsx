import { it } from "@effect/vitest";
import { Effect, Layer, ManagedRuntime } from "effect";
import { describe, expect } from "vitest";
import { ConnectedHomePage } from "../../components/HomePage/HomePage.connected";
import type { Person } from "../../domain/FilmUniverse.model";
import {
  luke,
  makeCharacterId,
  personNamed,
} from "../../domain/FilmUniverse.fixture";
import { layer as i18nLayer } from "../../i18n/I18n.service";
import { PeopleCatalogError } from "../../services/PeopleCatalog";
import { layerStub } from "../../services/SwapiPeopleCatalog.layer";
import { makeHomePage, type HomePageRuntime } from "./HomePage.factory";

const runtimeFor = (person: Person): HomePageRuntime =>
  ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() => Effect.succeed(person)),
    ),
  );

const failingRuntime = (): HomePageRuntime =>
  ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() =>
        Effect.fail(new PeopleCatalogError({ message: "offline" })),
      ),
    ),
  );

const action = async () => {
  throw new Error("the page test does not submit the form");
};

describe("makeHomePage", () => {
  it("renders the same page through two dependency layers", async () => {
    const StarWarsPage = makeHomePage(
      runtimeFor(luke),
      action,
      "/star-wars/funnel",
    );
    const GhibliPage = makeHomePage(
      runtimeFor(personNamed(makeCharacterId("1"), "Haku")),
      action,
      "/ghibli/funnel",
    );

    const starWars = await StarWarsPage();
    const ghibli = await GhibliPage();

    expect(starWars.type).toBe(ConnectedHomePage);
    expect(ghibli.type).toBe(ConnectedHomePage);
    expect(starWars.props).toMatchObject({
      model: {
        _tag: "Loaded",
        person: { name: "Luke Skywalker" },
        hero: { funnelHref: "/star-wars/funnel" },
      },
      searchAction: action,
    });
    expect(ghibli.props).toMatchObject({
      model: {
        _tag: "Loaded",
        person: { name: "Haku" },
        hero: { funnelHref: "/ghibli/funnel" },
      },
      searchAction: action,
    });
  });

  it("sets the funnel link on a failed page too", async () => {
    const FailedPage = makeHomePage(
      failingRuntime(),
      action,
      "/ghibli/funnel",
    );

    const failed = await FailedPage();

    expect(failed.props).toMatchObject({
      model: {
        _tag: "Failed",
        hero: { funnelHref: "/ghibli/funnel" },
      },
    });
  });
});
