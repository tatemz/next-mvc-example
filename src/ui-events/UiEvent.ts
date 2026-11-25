import { Schema } from "effect";
import { Universe } from "../domain/FilmUniverse.model";

export const Page = Schema.Literals(["home", "funnel", "results"]);
export type Page = typeof Page.Type;

export const TransportChoice = Schema.TaggedUnion({
  TransportChosen: {
    key: Schema.NonEmptyString,
  },
  NoTransport: {},
});
export type TransportChoice = typeof TransportChoice.Type;

export const makeTransportChoice = (
  transport: { readonly key: string } | null,
): TransportChoice =>
  transport === null
    ? TransportChoice.cases.NoTransport.make({})
    : TransportChoice.cases.TransportChosen.make({
      key: transport.key,
    });

export const PageContext = Schema.TaggedUnion({
  Home: {
    universe: Universe,
  },
  FunnelSearch: {
    universe: Universe,
  },
  FunnelChoose: {
    universe: Universe,
    query: Schema.NonEmptyString,
  },
  FunnelFilm: {
    universe: Universe,
    characterId: Schema.NonEmptyString,
  },
  FunnelTransport: {
    universe: Universe,
    characterId: Schema.NonEmptyString,
    filmOrder: Schema.Int,
  },
  FunnelReview: {
    universe: Universe,
    characterId: Schema.NonEmptyString,
    filmOrder: Schema.Int,
    transport: TransportChoice,
  },
  FunnelFailed: {
    universe: Universe,
  },
  ResultsMissing: {
    universe: Universe,
  },
  ResultsReady: {
    universe: Universe,
    characterId: Schema.NonEmptyString,
    filmOrder: Schema.Int,
    transport: TransportChoice,
  },
});
export type PageContext = typeof PageContext.Type;

export type FunnelContext = Extract<
  PageContext,
  {
    _tag:
      | "FunnelSearch"
      | "FunnelChoose"
      | "FunnelFilm"
      | "FunnelTransport"
      | "FunnelReview"
      | "FunnelFailed";
  }
>;

export type ResultsContext = Extract<
  PageContext,
  { _tag: "ResultsMissing" | "ResultsReady" }
>;

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

export const CtaClicked = Schema.TaggedUnion({
  HomeCtaClicked: {
    context: PageContext.cases.Home,
    cta: Schema.Literal("build_dossier"),
  },
  FunnelSearchCtaClicked: {
    context: PageContext.cases.FunnelSearch,
    cta: Schema.Literal("search"),
  },
  FunnelChooseCtaClicked: {
    context: PageContext.cases.FunnelChoose,
    cta: Schema.Literal("choose_character"),
  },
  FunnelFilmCtaClicked: {
    context: PageContext.cases.FunnelFilm,
    cta: Schema.Literal("next_transport"),
  },
  FunnelTransportCtaClicked: {
    context: PageContext.cases.FunnelTransport,
    cta: Schema.Literal("review_dossier"),
  },
  FunnelReviewCtaClicked: {
    context: PageContext.cases.FunnelReview,
    cta: Schema.Literals(["open_dossier", "start_over"]),
  },
  FunnelFailedCtaClicked: {
    context: PageContext.cases.FunnelFailed,
    cta: Schema.Literal("start_over"),
  },
  ResultsMissingCtaClicked: {
    context: PageContext.cases.ResultsMissing,
    cta: Schema.Literal("build_another_dossier"),
  },
  ResultsReadyCtaClicked: {
    context: PageContext.cases.ResultsReady,
    cta: Schema.Literals(["build_another_dossier", "back_home"]),
  },
});
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
  CtaClicked.cases.HomeCtaClicked,
  CtaClicked.cases.FunnelSearchCtaClicked,
  CtaClicked.cases.FunnelChooseCtaClicked,
  CtaClicked.cases.FunnelFilmCtaClicked,
  CtaClicked.cases.FunnelTransportCtaClicked,
  CtaClicked.cases.FunnelReviewCtaClicked,
  CtaClicked.cases.FunnelFailedCtaClicked,
  CtaClicked.cases.ResultsMissingCtaClicked,
  CtaClicked.cases.ResultsReadyCtaClicked,
  FormValidationError,
  InputFilled,
]).pipe(Schema.toTaggedUnion("_tag"));
export type UiEvent = typeof UiEvent.Type;
