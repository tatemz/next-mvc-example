import { Match } from "effect";
import type {
  Page,
  PageContext,
  TransportChoice,
  UiEvent,
  Universe,
} from "./UiEvent";

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

type ContextPayload = {
  readonly page: Page;
  readonly universe: Universe;
  readonly properties: Readonly<Record<string, UiEventProperty>>;
};

const transportProperties = (
  transport: TransportChoice,
): Readonly<Record<string, UiEventProperty>> =>
  Match.valueTags(transport, {
    TransportChosen: (chosen) => ({ transportKey: chosen.key }),
    NoTransport: () => ({}),
  });

const contextPayload = (context: PageContext): ContextPayload =>
  Match.valueTags(context, {
    Home: (home) => ({
      page: "home" as const,
      universe: home.universe,
      properties: {},
    }),
    FunnelSearch: (search) => ({
      page: "funnel" as const,
      universe: search.universe,
      properties: {},
    }),
    FunnelChoose: (choose) => ({
      page: "funnel" as const,
      universe: choose.universe,
      properties: { query: choose.query },
    }),
    FunnelFilm: (film) => ({
      page: "funnel" as const,
      universe: film.universe,
      properties: { characterId: film.characterId },
    }),
    FunnelTransport: (transport) => ({
      page: "funnel" as const,
      universe: transport.universe,
      properties: {
        characterId: transport.characterId,
        filmOrder: transport.filmOrder,
      },
    }),
    FunnelReview: (review) => ({
      page: "funnel" as const,
      universe: review.universe,
      properties: {
        characterId: review.characterId,
        filmOrder: review.filmOrder,
        ...transportProperties(review.transport),
      },
    }),
    FunnelFailed: (failed) => ({
      page: "funnel" as const,
      universe: failed.universe,
      properties: {},
    }),
    ResultsMissing: (missing) => ({
      page: "results" as const,
      universe: missing.universe,
      properties: {},
    }),
    ResultsReady: (ready) => ({
      page: "results" as const,
      universe: ready.universe,
      properties: {
        characterId: ready.characterId,
        filmOrder: ready.filmOrder,
        ...transportProperties(ready.transport),
      },
    }),
  });

export const toUiEventPayload = (
  event: UiEvent,
  occurredAt: string,
): UiEventPayload =>
  Match.valueTags(event, {
    PageLoaded: (loaded) => ({
      event: "page_loaded",
      ...contextPayload(loaded.context),
      occurredAt,
    }),
    CtaClicked: (clicked) => {
      const context = contextPayload(clicked.context);
      return {
        event: "cta_clicked",
        page: context.page,
        universe: context.universe,
        occurredAt,
        properties: {
          ...context.properties,
          cta: clicked.cta,
        },
      };
    },
    FormValidationError: (error) => ({
      event: "form_validation_error",
      page: "funnel" as const,
      universe: error.universe,
      occurredAt,
      properties: {
        form: error.form,
        message: error.message,
        query: error.query,
      },
    }),
    InputFilled: (input) => ({
      event: "input_filled",
      page: "funnel" as const,
      universe: input.universe,
      occurredAt,
      properties: {
        field: input.field,
        value: input.value,
      },
    }),
  });

export const makeUiEventHandler = (
  sinks: ReadonlyArray<UiEventSink>,
  now: () => string,
): UiEventHandler =>
  (event) => {
    const payload = toUiEventPayload(event, now());
    for (const sink of sinks) {
      try {
        sink(payload);
      } catch (error) {
        console.error("ui event sink failed", error);
      }
    }
  };
