import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import {
  CtaClicked,
  FormValidationError,
  InputFilled,
  PageLoaded,
} from "./UiEvent";
import { makeUiEventHandler, toUiEventPayload } from "./UiEventHandler";

const occurredAt = "2026-11-24T12:00:00.000Z";

describe("toUiEventPayload", () => {
  it("maps a page load with domain metadata", () => {
    expect(
      toUiEventPayload(
        PageLoaded.make({
          page: "results",
          universe: "ghibli",
          characterId: "1",
          filmOrder: 1,
          transportKey: "red-wing",
        }),
        occurredAt,
      ),
    ).toEqual({
      event: "page_loaded",
      page: "results",
      universe: "ghibli",
      occurredAt,
      properties: {
        characterId: "1",
        filmOrder: 1,
        transportKey: "red-wing",
      },
    });
  });

  it("maps a CTA click", () => {
    expect(
      toUiEventPayload(
        CtaClicked.make({
          page: "funnel",
          universe: "star-wars",
          cta: "choose_character",
          characterId: "1",
          query: "Luke",
        }),
        occurredAt,
      ),
    ).toMatchObject({
      event: "cta_clicked",
      properties: {
        cta: "choose_character",
        characterId: "1",
        query: "Luke",
      },
    });
  });

  it("maps a form validation error", () => {
    expect(
      toUiEventPayload(
        FormValidationError.make({
          page: "home",
          universe: "star-wars",
          form: "home_search",
          message: "Character id is required.",
          characterId: " ",
        }),
        occurredAt,
      ),
    ).toMatchObject({
      event: "form_validation_error",
      properties: {
        form: "home_search",
        message: "Character id is required.",
        characterId: " ",
      },
    });
  });

  it("maps an input fill", () => {
    expect(
      toUiEventPayload(
        InputFilled.make({
          page: "funnel",
          universe: "ghibli",
          field: "funnel_query",
          value: "Haku",
        }),
        occurredAt,
      ),
    ).toMatchObject({
      event: "input_filled",
      properties: {
        field: "funnel_query",
        value: "Haku",
      },
    });
  });
});

describe("makeUiEventHandler", () => {
  it("adds the timestamp and sends the payload to the sink", () => {
    const payloads: Array<unknown> = [];
    const handler = makeUiEventHandler(
      (payload) => payloads.push(payload),
      () => occurredAt,
    );

    handler(
      PageLoaded.make({
        page: "home",
        universe: "star-wars",
      }),
    );

    expect(payloads).toEqual([
      {
        event: "page_loaded",
        page: "home",
        universe: "star-wars",
        occurredAt,
        properties: {},
      },
    ]);
  });
});
