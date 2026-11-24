import {
  Array,
  Data,
  Effect,
  Record,
  Schema,
  type SchemaIssue,
} from "effect";

export type FormDataRecord = Readonly<Record<string, string>>;

export const toRecord = (formData: globalThis.FormData) => {
  const entries = Array.map(
    Array.fromIterable(formData),
    ([key, value]) =>
      [
        key,
        typeof value === "string" ? value : value.name,
      ] as const,
  );
  return Record.fromEntries(entries);
};

export const getString = (record: FormDataRecord, key: string) =>
  record[key] ?? "";

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
      const decoded = Schema.decodeUnknownEffect(schema)(formDataRecord);

      return yield* decoded.pipe(
        Effect.mapError(
          (error) =>
            new FormValidationError({
              formData: formDataRecord,
              errors: toErrors(error.issue),
            }),
        ),
      );
    });
