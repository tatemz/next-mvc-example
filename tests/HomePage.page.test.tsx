import { describe, expect, it, vi } from "vitest";
import { loadHomePage, presentLoadedHomePage } from "../src/controllers/HomePage.controller";
import { makeEn } from "../src/i18n/I18n.service";
import { luke } from "./fixtures/Person.fixture";

const { runPromise } = vi.hoisted(() => ({ runPromise: vi.fn() }));
vi.mock("../src/server/Runtime", () => ({ runtime: { runPromise } }));

import { HomePage } from "../src/page-modules/HomePage/HomePage.page";

describe("HomePage page", () => {
  it("loads the model through the runtime", async () => {
    const model = presentLoadedHomePage(makeEn(), luke);
    runPromise.mockResolvedValue(model);

    const element = await HomePage();

    expect(runPromise).toHaveBeenCalledWith(loadHomePage);
    expect(element.props.model).toBe(model);
  });
});
