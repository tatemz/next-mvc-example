import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { FunnelPage } from "../../../src/page-modules/Funnel/Funnel.page";
import FunnelRoute from "./page";

describe("universe funnel route", () => {
  it("exposes the funnel page", () => {
    expect(FunnelRoute).toBe(FunnelPage);
  });
});
