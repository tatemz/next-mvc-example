import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConnectedHomePage } from "../src/components/HomePage/HomePage.connected.view";
import { presentLoadedHomePage } from "../src/controllers/HomePage.controller";
import { luke } from "./fixtures/Person.fixture";

describe("ConnectedHomePage", () => {
  it("renders the initial model", () => {
    const html = renderToStaticMarkup(
      <ConnectedHomePage model={presentLoadedHomePage(luke)} />,
    );

    expect(html).toContain("Luke Skywalker");
  });
});
