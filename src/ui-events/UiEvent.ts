import { Schema } from "effect";

export const Universe = Schema.Literals(["star-wars", "ghibli"]);
export type Universe = typeof Universe.Type;

export const Page = Schema.Literals(["home", "funnel", "results"]);
export type Page = typeof Page.Type;

export const TransportChosen = Schema.TaggedStruct("TransportChosen", {
  key: Schema.NonEmptyString,
});
export type TransportChosen = typeof TransportChosen.Type;

export const NoTransport = Schema.TaggedStruct("NoTransport", {});
export type NoTransport = typeof NoTransport.Type;

export const TransportChoice = Schema.Union([
  TransportChosen,
  NoTransport,
]);
export type TransportChoice = typeof TransportChoice.Type;

export const makeTransportChoice = (
  transport: { readonly key: string } | null,
): TransportChoice =>
  transport === null
    ? NoTransport.make({})
    : TransportChosen.make({ key: transport.key });

export const HomeContext = Schema.TaggedStruct("Home", {
  universe: Universe,
});
export type HomeContext = typeof HomeContext.Type;

export const FunnelSearchContext = Schema.TaggedStruct("FunnelSearch", {
  universe: Universe,
});
export type FunnelSearchContext = typeof FunnelSearchContext.Type;

export const FunnelChooseContext = Schema.TaggedStruct("FunnelChoose", {
  universe: Universe,
  query: Schema.NonEmptyString,
});
export type FunnelChooseContext = typeof FunnelChooseContext.Type;

export const FunnelFilmContext = Schema.TaggedStruct("FunnelFilm", {
  universe: Universe,
  characterId: Schema.NonEmptyString,
});
export type FunnelFilmContext = typeof FunnelFilmContext.Type;

export const FunnelTransportContext = Schema.TaggedStruct(
  "FunnelTransport",
  {
    universe: Universe,
    characterId: Schema.NonEmptyString,
    filmOrder: Schema.Int,
  },
);
export type FunnelTransportContext =
  typeof FunnelTransportContext.Type;

export const FunnelReviewContext = Schema.TaggedStruct("FunnelReview", {
  universe: Universe,
  characterId: Schema.NonEmptyString,
  filmOrder: Schema.Int,
  transport: TransportChoice,
});
export type FunnelReviewContext = typeof FunnelReviewContext.Type;

export const FunnelFailedContext = Schema.TaggedStruct("FunnelFailed", {
  universe: Universe,
});
export type FunnelFailedContext = typeof FunnelFailedContext.Type;

export const ResultsMissingContext = Schema.TaggedStruct(
  "ResultsMissing",
  {
    universe: Universe,
  },
);
export type ResultsMissingContext =
  typeof ResultsMissingContext.Type;

export const ResultsReadyContext = Schema.TaggedStruct("ResultsReady", {
  universe: Universe,
  characterId: Schema.NonEmptyString,
  filmOrder: Schema.Int,
  transport: TransportChoice,
});
export type ResultsReadyContext = typeof ResultsReadyContext.Type;

export const FunnelContext = Schema.Union([
  FunnelSearchContext,
  FunnelChooseContext,
  FunnelFilmContext,
  FunnelTransportContext,
  FunnelReviewContext,
  FunnelFailedContext,
]);
export type FunnelContext = typeof FunnelContext.Type;

export const ResultsContext = Schema.Union([
  ResultsMissingContext,
  ResultsReadyContext,
]);
export type ResultsContext = typeof ResultsContext.Type;

export const PageContext = Schema.Union([
  HomeContext,
  FunnelSearchContext,
  FunnelChooseContext,
  FunnelFilmContext,
  FunnelTransportContext,
  FunnelReviewContext,
  FunnelFailedContext,
  ResultsMissingContext,
  ResultsReadyContext,
]);
export type PageContext = typeof PageContext.Type;

export const PageLoaded = Schema.TaggedStruct("PageLoaded", {
  context: PageContext,
});
export type PageLoaded = typeof PageLoaded.Type;

export const FunnelCta = Schema.Literals([
  "search",
  "choose_character",
  "next_transport",
  "review_dossier",
  "open_dossier",
  "start_over",
]);
export type FunnelCta = typeof FunnelCta.Type;

export const ResultsCta = Schema.Literals([
  "build_another_dossier",
  "back_home",
]);
export type ResultsCta = typeof ResultsCta.Type;

export const HomeCtaClicked = Schema.TaggedStruct("CtaClicked", {
  context: HomeContext,
  cta: Schema.Literal("build_dossier"),
});
export type HomeCtaClicked = typeof HomeCtaClicked.Type;

export const FunnelSearchCtaClicked = Schema.TaggedStruct(
  "CtaClicked",
  {
    context: FunnelSearchContext,
    cta: Schema.Literal("search"),
  },
);
export type FunnelSearchCtaClicked =
  typeof FunnelSearchCtaClicked.Type;

export const FunnelChooseCtaClicked = Schema.TaggedStruct(
  "CtaClicked",
  {
    context: FunnelChooseContext,
    cta: Schema.Literal("choose_character"),
  },
);
export type FunnelChooseCtaClicked =
  typeof FunnelChooseCtaClicked.Type;

export const FunnelFilmCtaClicked = Schema.TaggedStruct("CtaClicked", {
  context: FunnelFilmContext,
  cta: Schema.Literal("next_transport"),
});
export type FunnelFilmCtaClicked = typeof FunnelFilmCtaClicked.Type;

export const FunnelTransportCtaClicked = Schema.TaggedStruct(
  "CtaClicked",
  {
    context: FunnelTransportContext,
    cta: Schema.Literal("review_dossier"),
  },
);
export type FunnelTransportCtaClicked =
  typeof FunnelTransportCtaClicked.Type;

export const FunnelReviewCtaClicked = Schema.TaggedStruct(
  "CtaClicked",
  {
    context: FunnelReviewContext,
    cta: Schema.Literals(["open_dossier", "start_over"]),
  },
);
export type FunnelReviewCtaClicked =
  typeof FunnelReviewCtaClicked.Type;

export const FunnelFailedCtaClicked = Schema.TaggedStruct(
  "CtaClicked",
  {
    context: FunnelFailedContext,
    cta: Schema.Literal("start_over"),
  },
);
export type FunnelFailedCtaClicked =
  typeof FunnelFailedCtaClicked.Type;

export const ResultsMissingCtaClicked = Schema.TaggedStruct(
  "CtaClicked",
  {
    context: ResultsMissingContext,
    cta: Schema.Literal("build_another_dossier"),
  },
);
export type ResultsMissingCtaClicked =
  typeof ResultsMissingCtaClicked.Type;

export const ResultsReadyCtaClicked = Schema.TaggedStruct(
  "CtaClicked",
  {
    context: ResultsReadyContext,
    cta: Schema.Literals(["build_another_dossier", "back_home"]),
  },
);
export type ResultsReadyCtaClicked =
  typeof ResultsReadyCtaClicked.Type;

export const CtaClicked = Schema.Union([
  HomeCtaClicked,
  FunnelSearchCtaClicked,
  FunnelChooseCtaClicked,
  FunnelFilmCtaClicked,
  FunnelTransportCtaClicked,
  FunnelReviewCtaClicked,
  FunnelFailedCtaClicked,
  ResultsMissingCtaClicked,
  ResultsReadyCtaClicked,
]);
export type CtaClicked = typeof CtaClicked.Type;

export const FormValidationError = Schema.TaggedStruct(
  "FormValidationError",
  {
    universe: Universe,
    form: Schema.Literal("funnel_search"),
    query: Schema.String,
    message: Schema.NonEmptyString,
  },
);
export type FormValidationError = typeof FormValidationError.Type;

export const InputFilled = Schema.TaggedStruct("InputFilled", {
  universe: Universe,
  field: Schema.Literal("funnel_query"),
  value: Schema.String,
});
export type InputFilled = typeof InputFilled.Type;

export const UiEvent = Schema.Union([
  PageLoaded,
  HomeCtaClicked,
  FunnelSearchCtaClicked,
  FunnelChooseCtaClicked,
  FunnelFilmCtaClicked,
  FunnelTransportCtaClicked,
  FunnelReviewCtaClicked,
  FunnelFailedCtaClicked,
  ResultsMissingCtaClicked,
  ResultsReadyCtaClicked,
  FormValidationError,
  InputFilled,
]);
export type UiEvent = typeof UiEvent.Type;
