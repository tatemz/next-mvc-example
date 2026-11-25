import { it } from "@effect/vitest";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string, type?: string) => {
    throw new Error(`NEXT_REDIRECT;${type};${url}`);
  }),
}));

import { redirect } from "next/navigation";
import { NextRedirect, handleNextRedirect } from "./NextRedirect";

describe("handleNextRedirect", () => {
  it("throws Next's redirect for a redirect outcome", () => {
    expect(() =>
      handleNextRedirect(
        NextRedirect.make({ url: "/star-wars", type: "replace" }),
      ),
    ).toThrow("NEXT_REDIRECT;replace;/star-wars");
    expect(redirect).toHaveBeenCalledWith("/star-wars", "replace");
  });

  it("returns a non-redirect result unchanged", () => {
    expect(handleNextRedirect("a rendered page")).toBe("a rendered page");
    expect(redirect).not.toHaveBeenCalled();
  });
});
