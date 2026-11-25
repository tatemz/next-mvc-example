import { Match } from "effect";
import type { Page, UiEvent, Universe } from "./UiEvent";

export type UiEventProperty = string | number | boolean;

export type UiEventPayload = {
  readonly event: string;
  readonly page: Page;
  readonly universe: Universe;
  readonly occurredAt: string;
  readonly properties: Readonly<Record<string, UiEventProperty>>;
};

export type UiEventSink = (payload: UiEventPayload) => void;
export type UiEventHandler = (event: UiEvent) => void;

type Metadata = {
  readonly characterId?: string;
  readonly filmOrder?: number;
  readonly transportKey?: string;
  readonly query?: string;
};

const metadataProperties = (event: Metadata) => {
  const properties: Record<string, UiEventProperty> = {};

  if (event.characterId !== undefined) {
    properties.characterId = event.characterId;
  }
  if (event.filmOrder !== undefined) {
    properties.filmOrder = event.filmOrder;
  }
  if (event.transportKey !== undefined) {
    properties.transportKey = event.transportKey;
  }
  if (event.query !== undefined) {
    properties.query = event.query;
  }

  return properties;
};

export const toUiEventPayload = (
  event: UiEvent,
  occurredAt: string,
): UiEventPayload =>
  Match.valueTags(event, {
    PageLoaded: (loaded) => ({
      event: "page_loaded",
      page: loaded.page,
      universe: loaded.universe,
      occurredAt,
      properties: metadataProperties(loaded),
    }),
    CtaClicked: (clicked) => ({
      event: "cta_clicked",
      page: clicked.page,
      universe: clicked.universe,
      occurredAt,
      properties: {
        cta: clicked.cta,
        ...metadataProperties(clicked),
      },
    }),
    FormValidationError: (error) => ({
      event: "form_validation_error",
      page: error.page,
      universe: error.universe,
      occurredAt,
      properties: {
        form: error.form,
        message: error.message,
        ...metadataProperties(error),
      },
    }),
    InputFilled: (input) => ({
      event: "input_filled",
      page: input.page,
      universe: input.universe,
      occurredAt,
      properties: {
        field: input.field,
        value: input.value,
      },
    }),
  });

export const makeUiEventHandler = (
  sink: UiEventSink,
  now: () => string,
): UiEventHandler =>
  (event) => sink(toUiEventPayload(event, now()));
