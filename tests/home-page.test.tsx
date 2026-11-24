import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makeFooBarListModel } from "../src/components/FooBarList/factory";
import { makeHomePageModel } from "../src/components/HomePage/factory";
import { HomePage } from "../src/components/HomePage/view";

describe("makeHomePageModel", () => {
  it("builds variation A", () => {
    expect(makeHomePageModel({ variation: "a" })).toMatchObject({
      _tag: "HomePageVariationAModel",
      title: "Home Page: Variation A",
    });
  });

  it("builds variation B with its list", () => {
    const model = makeHomePageModel({ variation: "b" });

    if (model._tag !== "HomePageVariationBModel") {
      throw new Error(`expected variation B, got ${model._tag}`);
    }
    expect(model.title).toBe("Home Page: Variation B");
    expect(model.fooBarList.items).toHaveLength(5);
  });
});

describe("makeFooBarListModel", () => {
  it("numbers items from one", () => {
    const model = makeFooBarListModel({ numberOfItems: 3 });

    expect(model.items.map((item) => item.listItemText)).toEqual([
      "List item #1",
      "List item #2",
      "List item #3",
    ]);
  });
});

describe("HomePage", () => {
  it("renders variation A", () => {
    const html = renderToStaticMarkup(
      <HomePage {...makeHomePageModel({ variation: "a" })} />,
    );

    expect(html).toContain("<h1>Home Page: Variation A</h1>");
  });

  it("renders variation B and its five list items", () => {
    const html = renderToStaticMarkup(
      <HomePage {...makeHomePageModel({ variation: "b" })} />,
    );

    expect(html).toContain("<h2>Home Page: Variation B</h2>");
    expect(html.match(/<li>/g)).toHaveLength(5);
    expect(html).toContain("<li>List item #1</li>");
  });
});
