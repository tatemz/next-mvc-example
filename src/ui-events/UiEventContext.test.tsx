import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { useUiEventDispatch } from "./UiEventContext";

const Consumer = () => {
  useUiEventDispatch();
  return null;
};

describe("useUiEventDispatch", () => {
  it("requires a provider", () => {
    expect(() => renderToStaticMarkup(<Consumer />)).toThrow(
      "UiEventProvider is required.",
    );
  });
});
