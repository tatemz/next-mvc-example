import { describe, expect, it } from "vitest";
import { HomePageOptics } from "../src/components/HomePage/HomePage.optics";
import { presentLoadedHomePage } from "../src/controllers/HomePage.controller";
import { makeEn } from "../src/i18n/I18n.service";
import { luke } from "./fixtures/Person.fixture";

describe("HomePageOptics", () => {
  it("sets and reads the form error without mutating the model", () => {
    const model = presentLoadedHomePage(makeEn(), luke);
    const updated = HomePageOptics.FormError.set("Bad id")(model);

    expect(HomePageOptics.FormError.get(updated)).toBe("Bad id");
    expect(model.form.error).toBeUndefined();
  });
});
