import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { HomePageOptics } from "./HomePage.optics";
import { presentLoadedHomePage } from "../../controllers/HomePage.controller";
import { makeEn } from "../../i18n/I18n.service";
import { luke } from "../../domain/StarWars.fixture";

describe("HomePageOptics", () => {
  it("sets and reads the form error without mutating the model", () => {
    const model = presentLoadedHomePage(makeEn(), luke);
    const updated = HomePageOptics.FormError.set("Bad id")(model);

    expect(HomePageOptics.FormError.get(updated)).toBe("Bad id");
    expect(model.form.error).toBeUndefined();
  });
});
