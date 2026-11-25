import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import FunnelRoute from "./page";
import { GhibliFunnelPage } from "../../../src/page-modules/Funnel/GhibliFunnel.page";

describe("Ghibli funnel route", () => {
  it("exposes the Ghibli funnel page", () => {
    expect(FunnelRoute).toBe(GhibliFunnelPage);
  });
});
