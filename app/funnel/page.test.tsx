import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import FunnelRoute from "./page";
import { FunnelPage } from "../../src/page-modules/Funnel/Funnel.page";

describe("funnel route", () => {
  it("exposes the Funnel page as the route", () => {
    expect(FunnelRoute).toBe(FunnelPage);
  });
});
