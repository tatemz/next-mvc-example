import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import FunnelRoute from "./page";
import { StarWarsFunnelPage } from "../../../src/page-modules/Funnel/StarWarsFunnel.page";

describe("Star Wars funnel route", () => {
  it("exposes the Star Wars funnel page", () => {
    expect(FunnelRoute).toBe(StarWarsFunnelPage);
  });
});
