import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { PersonViewModel } from "./PersonCard.model";
import { PersonCard } from "./PersonCard.view";

describe("PersonCard", () => {
  it("renders person labels from the model", () => {
    const html = renderToStaticMarkup(
      <PersonCard
        {...PersonViewModel.make({
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
          heightLabel: "Tallness",
          massLabel: "Heft",
        })}
      />,
    );

    expect(html).toContain("Tallness");
    expect(html).toContain("Heft");
  });
});
