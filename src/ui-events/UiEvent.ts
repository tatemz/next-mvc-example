import { Schema } from "effect";

export const Universe = Schema.Literals(["star-wars", "ghibli"]);
export type Universe = typeof Universe.Type;

export const Page = Schema.Literals(["home", "funnel", "results"]);
export type Page = typeof Page.Type;

const MetadataFields = {
  characterId: Schema.optional(Schema.String),
  filmOrder: Schema.optional(Schema.Int),
  transportKey: Schema.optional(Schema.String),
  query: Schema.optional(Schema.String),
} as const;

export const PageLoaded = Schema.TaggedStruct("PageLoaded", {
  page: Page,
  universe: Universe,
  ...MetadataFields,
});
export type PageLoaded = typeof PageLoaded.Type;

export const CtaClicked = Schema.TaggedStruct("CtaClicked", {
  page: Page,
  universe: Universe,
  cta: Schema.NonEmptyString,
  ...MetadataFields,
});
export type CtaClicked = typeof CtaClicked.Type;

export const FormValidationError = Schema.TaggedStruct(
  "FormValidationError",
  {
    page: Page,
    universe: Universe,
    form: Schema.NonEmptyString,
    message: Schema.NonEmptyString,
    ...MetadataFields,
  },
);
export type FormValidationError = typeof FormValidationError.Type;

export const InputFilled = Schema.TaggedStruct("InputFilled", {
  page: Page,
  universe: Universe,
  field: Schema.NonEmptyString,
  value: Schema.String,
});
export type InputFilled = typeof InputFilled.Type;

export const UiEvent = Schema.Union([
  PageLoaded,
  CtaClicked,
  FormValidationError,
  InputFilled,
]);
export type UiEvent = typeof UiEvent.Type;
