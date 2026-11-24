import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { validateSearchForm } from "./SearchPerson.schema";

const form = (characterId: string) => {
  const data = new FormData();
  data.set("characterId", characterId);
  return data;
};

describe("validateSearchForm", () => {
  it.effect("returns the required message key for a missing field", () =>
    Effect.gen(function*() {
      const error = yield* validateSearchForm(new FormData()).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "FormValidationError",
        errors: { characterId: "search.characterId.required" },
      });
    }),
  );

  it.effect("returns the invalid message key for bad data", () =>
    Effect.gen(function*() {
      const error = yield* validateSearchForm(form("abc")).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "FormValidationError",
        errors: { characterId: "search.characterId.invalid" },
      });
    }),
  );

  it.effect("returns the invalid message key for an empty field", () =>
    Effect.gen(function*() {
      const error = yield* validateSearchForm(form("")).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "FormValidationError",
        errors: { characterId: "search.characterId.invalid" },
      });
    }),
  );

  it.effect("decodes a valid form", () =>
    Effect.gen(function*() {
      const data = yield* validateSearchForm(form("3"));

      expect(data.characterId).toBe("3");
    }),
  );
});
