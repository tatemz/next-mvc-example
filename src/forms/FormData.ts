import {
  Array,
  Function,
  Option,
  Predicate,
  Record,
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
    Record.get(record, key),
    () => "",
  );

