import { it } from "@effect/vitest";
import { afterEach, describe, expect, vi } from "vitest";
import {
  CtaClicked,
  FormValidationError,
  InputFilled,
  PageContext,
  PageLoaded,
  TransportChoice,
} from "./UiEvent";
import { makeUiEventHandler, toUiEventPayload } from "./UiEventHandler";

const occurredAt = "2026-11-24T12:00:00.000Z";

const transportChosen = TransportChoice.cases.TransportChosen.make({ key: "starship-12" });
const noTransport = TransportChoice.cases.NoTransport.make({});

const payloadOf = (event: Parameters<typeof toUiEventPayload>[0]) =>
  toUiEventPayload(event, occurredAt);

describe("toUiEventPayload", () => {
  it("maps the home page load", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.Home.make({ universe: "star-wars" }),
        }),
      ),
    ).toEqual({
      event: "page_loaded",
      page: "home",
      universe: "star-wars",
      occurredAt,
      properties: {},
    });
  });

  it("maps the funnel search page load", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.FunnelSearch.make({ universe: "ghibli" }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      universe: "ghibli",
      properties: {},
    });
  });

  it("maps the funnel choose page load with its query", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.FunnelChoose.make({
            universe: "star-wars",
            query: "Luke",
          }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      properties: { query: "Luke" },
    });
  });

  it("maps the funnel film page load with its character", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.FunnelFilm.make({
            universe: "star-wars",
            characterId: "1",
          }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      properties: { characterId: "1" },
    });
  });

  it("maps the funnel transport page load", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.FunnelTransport.make({
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
          }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      properties: { characterId: "1", filmOrder: 4 },
    });
  });

  it("maps the funnel review page load with a chosen transport", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.FunnelReview.make({
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
            transport: transportChosen,
          }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      properties: {
        characterId: "1",
        filmOrder: 4,
        transportKey: "starship-12",
      },
    });
  });

  it("maps the funnel review page load with no transport", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.FunnelReview.make({
            universe: "ghibli",
            characterId: "1",
            filmOrder: 1,
            transport: noTransport,
          }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      properties: { characterId: "1", filmOrder: 1 },
    });
  });

  it("maps the funnel failed page load", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.FunnelFailed.make({ universe: "star-wars" }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "funnel",
      properties: {},
    });
  });

  it("maps the missing results page load", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.ResultsMissing.make({ universe: "ghibli" }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "results",
      universe: "ghibli",
      properties: {},
    });
  });

  it("maps the ready results page load with a chosen transport", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.ResultsReady.make({
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
            transport: transportChosen,
          }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "results",
      properties: {
        characterId: "1",
        filmOrder: 4,
        transportKey: "starship-12",
      },
    });
  });

  it("maps the ready results page load with no transport", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: PageContext.cases.ResultsReady.make({
            universe: "ghibli",
            characterId: "1",
            filmOrder: 1,
            transport: noTransport,
          }),
        }),
      ),
    ).toMatchObject({
      event: "page_loaded",
      page: "results",
      properties: { characterId: "1", filmOrder: 1 },
    });
  });

  it("maps the home CTA click", () => {
    expect(
      payloadOf(
        CtaClicked.cases.HomeCtaClicked.make({
          context: PageContext.cases.Home.make({ universe: "star-wars" }),
          cta: "build_dossier",
        }),
      ),
    ).toEqual({
      event: "cta_clicked",
      page: "home",
      universe: "star-wars",
      occurredAt,
      properties: { cta: "build_dossier" },
    });
  });

  it("maps a funnel CTA click with its stage facts", () => {
    expect(
      payloadOf(
        CtaClicked.cases.FunnelChooseCtaClicked.make({
          context: PageContext.cases.FunnelChoose.make({
            universe: "star-wars",
            query: "Luke",
          }),
          cta: "choose_character",
        }),
      ),
    ).toMatchObject({
      event: "cta_clicked",
      page: "funnel",
      properties: { cta: "choose_character", query: "Luke" },
    });
  });

  it("maps a results CTA click with its dossier facts", () => {
    expect(
      payloadOf(
        CtaClicked.cases.ResultsReadyCtaClicked.make({
          context: PageContext.cases.ResultsReady.make({
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
            transport: transportChosen,
          }),
          cta: "back_home",
        }),
      ),
    ).toMatchObject({
      event: "cta_clicked",
      page: "results",
      properties: {
        cta: "back_home",
        characterId: "1",
        filmOrder: 4,
        transportKey: "starship-12",
      },
    });
  });

  it("maps every CTA variant", () => {
    const cases = [
      {
        event: CtaClicked.cases.HomeCtaClicked.make({
          context: PageContext.cases.Home.make({
            universe: "star-wars",
          }),
          cta: "build_dossier",
        }),
        page: "home",
        properties: { cta: "build_dossier" },
      },
      {
        event: CtaClicked.cases.FunnelSearchCtaClicked.make({
          context: PageContext.cases.FunnelSearch.make({
            universe: "star-wars",
          }),
          cta: "search",
        }),
        page: "funnel",
        properties: { cta: "search" },
      },
      {
        event: CtaClicked.cases.FunnelChooseCtaClicked.make({
          context: PageContext.cases.FunnelChoose.make({
            universe: "star-wars",
            query: "Luke",
          }),
          cta: "choose_character",
        }),
        page: "funnel",
        properties: {
          cta: "choose_character",
          query: "Luke",
        },
      },
      {
        event: CtaClicked.cases.FunnelFilmCtaClicked.make({
          context: PageContext.cases.FunnelFilm.make({
            universe: "star-wars",
            characterId: "1",
          }),
          cta: "next_transport",
        }),
        page: "funnel",
        properties: {
          cta: "next_transport",
          characterId: "1",
        },
      },
      {
        event: CtaClicked.cases.FunnelTransportCtaClicked.make({
          context: PageContext.cases.FunnelTransport.make({
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
          }),
          cta: "review_dossier",
        }),
        page: "funnel",
        properties: {
          cta: "review_dossier",
          characterId: "1",
          filmOrder: 4,
        },
      },
      {
        event: CtaClicked.cases.FunnelReviewCtaClicked.make({
          context: PageContext.cases.FunnelReview.make({
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
            transport: transportChosen,
          }),
          cta: "open_dossier",
        }),
        page: "funnel",
        properties: {
          cta: "open_dossier",
          characterId: "1",
          filmOrder: 4,
          transportKey: "starship-12",
        },
      },
      {
        event: CtaClicked.cases.FunnelFailedCtaClicked.make({
          context: PageContext.cases.FunnelFailed.make({
            universe: "star-wars",
          }),
          cta: "start_over",
        }),
        page: "funnel",
        properties: { cta: "start_over" },
      },
      {
        event: CtaClicked.cases.ResultsMissingCtaClicked.make({
          context: PageContext.cases.ResultsMissing.make({
            universe: "star-wars",
          }),
          cta: "build_another_dossier",
        }),
        page: "results",
        properties: { cta: "build_another_dossier" },
      },
      {
        event: CtaClicked.cases.ResultsReadyCtaClicked.make({
          context: PageContext.cases.ResultsReady.make({
            universe: "star-wars",
            characterId: "1",
            filmOrder: 4,
            transport: transportChosen,
          }),
          cta: "back_home",
        }),
        page: "results",
        properties: {
          cta: "back_home",
          characterId: "1",
          filmOrder: 4,
          transportKey: "starship-12",
        },
      },
    ];

    for (const { event, page, properties } of cases) {
      expect(payloadOf(event)).toMatchObject({
        event: "cta_clicked",
        page,
        properties,
      });
    }
  });

  it("maps the funnel validation error", () => {
    expect(
      payloadOf(
        FormValidationError.make({
          universe: "star-wars",
          form: "funnel_search",
          query: "",
          message: "Enter a character name.",
        }),
      ),
    ).toEqual({
      event: "form_validation_error",
      page: "funnel",
      universe: "star-wars",
      occurredAt,
      properties: {
        form: "funnel_search",
        message: "Enter a character name.",
        query: "",
      },
    });
  });

  it("maps the funnel input fill", () => {
    expect(
      payloadOf(
        InputFilled.make({
          universe: "ghibli",
          field: "funnel_query",
          value: "Haku",
        }),
      ),
    ).toEqual({
      event: "input_filled",
      page: "funnel",
      universe: "ghibli",
      occurredAt,
      properties: { field: "funnel_query", value: "Haku" },
    });
  });
});

const pageLoaded = PageLoaded.make({
  context: PageContext.cases.FunnelSearch.make({ universe: "star-wars" }),
});

const pageLoadedPayload = {
  event: "page_loaded",
  page: "funnel",
  universe: "star-wars",
  occurredAt,
  properties: {},
};

afterEach(() => vi.restoreAllMocks());

describe("makeUiEventHandler", () => {
  it("adds the timestamp and sends the payload to every sink", () => {
    const first: Array<unknown> = [];
    const second: Array<unknown> = [];
    const handler = makeUiEventHandler(
      [
        (payload) => first.push(payload),
        (payload) => second.push(payload),
      ],
      () => occurredAt,
    );

    handler(pageLoaded);

    expect(first).toEqual([pageLoadedPayload]);
    expect(second).toEqual([pageLoadedPayload]);
  });

  it("keeps the remaining sinks running when one fails", () => {
    const surviving = vi.fn();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const handler = makeUiEventHandler(
      [
        () => {
          throw new Error("boom");
        },
        surviving,
      ],
      () => occurredAt,
    );

    handler(pageLoaded);

    expect(surviving).toHaveBeenCalledWith(pageLoadedPayload);
    expect(consoleError).toHaveBeenCalledWith(
      "ui event sink failed",
      expect.any(Error),
    );
  });
});
