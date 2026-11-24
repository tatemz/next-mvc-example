import { describe, expect, it, vi } from "vitest";
import { presentLoadedHomePage } from "../src/components/HomePage/HomePage.presenter";
import { luke } from "./fixtures/Person.fixture";

const { runPromise } = vi.hoisted(() => ({ runPromise: vi.fn() }));
vi.mock("../src/server/Runtime", () => ({ runtime: { runPromise } }));

import { searchPerson } from "../src/actions/SearchPerson.serverAction";

describe("searchPerson server action", () => {
  it("runs the controller effect through the runtime", async () => {
    const model = presentLoadedHomePage(luke);
    runPromise.mockResolvedValue(model);

    await expect(searchPerson(model, new FormData())).resolves.toBe(model);
    expect(runPromise).toHaveBeenCalledOnce();
  });
});
