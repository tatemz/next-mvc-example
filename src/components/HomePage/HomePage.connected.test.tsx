import { renderToStaticMarkup } from "react-dom/server";
import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { ConnectedHomePage } from "./HomePage.connected.view";
import { presentLoadedHomePage } from "../../controllers/HomePage.controller";
import { makeEn } from "../../i18n/I18n.service";
import { luke } from "../../domain/StarWars.fixture";

describe("ConnectedHomePage", () => {
  it("renders the initial model", () => {
    const html = renderToStaticMarkup(
      <ConnectedHomePage {...presentLoadedHomePage(makeEn(), luke)} />,
    );

    expect(html).toContain("Luke Skywalker");
  });
});
