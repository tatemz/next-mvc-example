import { it } from "@effect/vitest";
import { afterEach, describe, expect, vi } from "vitest";
import {
  FunnelChooseContext,
  FunnelChooseCtaClicked,
  FunnelFailedContext,
  FunnelFilmContext,
  FunnelReviewContext,
  FunnelSearchContext,
  FunnelTransportContext,
  FormValidationError,
  HomeContext,
  HomeCtaClicked,
  InputFilled,
  NoTransport,
  PageLoaded,
  ResultsMissingContext,
  ResultsReadyContext,
  ResultsReadyCtaClicked,
  TransportChosen,
} from "./UiEvent";
import { makeUiEventHandler, toUiEventPayload } from "./UiEventHandler";

const occurredAt = "2026-11-24T12:00:00.000Z";

const transportChosen = TransportChosen.make({ key: "starship-12" });
const noTransport = NoTransport.make({});

const payloadOf = (event: Parameters<typeof toUiEventPayload>[0]) =>
  toUiEventPayload(event, occurredAt);

describe("toUiEventPayload", () => {
  it("maps the home page load", () => {
    expect(
      payloadOf(
        PageLoaded.make({
          context: HomeContext.make({ universe: "star-wars" }),
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
          context: FunnelSearchContext.make({ universe: "ghibli" }),
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
          context: FunnelChooseContext.make({
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
          context: FunnelFilmContext.make({
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
          context: FunnelTransportContext.make({
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
          context: FunnelReviewContext.make({
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
          context: FunnelReviewContext.make({
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
          context: FunnelFailedContext.make({ universe: "star-wars" }),
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
          context: ResultsMissingContext.make({ universe: "ghibli" }),
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
          context: ResultsReadyContext.make({
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
          context: ResultsReadyContext.make({
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
        HomeCtaClicked.make({
          context: HomeContext.make({ universe: "star-wars" }),
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
        FunnelChooseCtaClicked.make({
          context: FunnelChooseContext.make({
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
        ResultsReadyCtaClicked.make({
          context: ResultsReadyContext.make({
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
  context: FunnelSearchContext.make({ universe: "star-wars" }),
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
