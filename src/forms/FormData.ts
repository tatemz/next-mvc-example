import {
  Array,
  Data,
  Effect,
  Function,
  Option,
  Predicate,
  Record,
  Schema,
  type SchemaIssue,
} from "effect";

export type FormDataRecord = Readonly<Record<string, string>>;

export const toRecord = (formData: globalThis.FormData) => {
  const entries = Function.pipe(
    formData,
    Array.fromIterable,
    Array.map(
      ([key, value]) =>
        [
          key,
          Predicate.isString(value) ? value : value.name,
        ] as const,
    ),
  );
  return Record.fromEntries(entries);
};

export const getStringOrEmpty = (
  record: FormDataRecord,
  key: string,
) =>
  Option.getOrElse(
    Option.fromNullishOr(record[key]),
    () => "",
  );

export class FormValidationError<Errors> extends Data.TaggedError(
  "FormValidationError",
)<{
  readonly formData: FormDataRecord;
  readonly errors: Errors;
}> {}

export const validateFormData =
  <A, Errors>(
    schema: Schema.ConstraintDecoder<A>,
    toErrors: (issue: SchemaIssue.Issue) => Errors,
  ) =>
  (formData: globalThis.FormData) =>
    Effect.gen(function*() {
      const formDataRecord = toRecord(formData);
      const decoded = Schema.decodeEffect(schema)(formDataRecord);

      return yield* Function.pipe(
        decoded,
        Effect.mapError(
          (error) =>
            new FormValidationError({
              formData: formDataRecord,
              errors: toErrors(error.issue),
            }),
        ),
      );
    });
