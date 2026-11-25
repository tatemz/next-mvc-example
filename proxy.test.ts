import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

const request = (path: string) =>
  new NextRequest(`http://localhost${path}`);

describe("proxy", () => {
  it("redirects the root to the default home", () => {
    const response = proxy(request("/"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/star-wars",
    );
  });

  it("leaves a localized path alone", () => {
    const response = proxy(request("/es-MX/star-wars"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("rewrites an unprefixed path to the default locale", () => {
    const response = proxy(request("/star-wars/funnel?step=1"));

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "http://localhost/en-US/star-wars/funnel?step=1",
    );
  });
});
