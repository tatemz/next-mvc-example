import { Match } from "effect";
import { makeHomePageVariationAModel } from "../HomePageVariationA/factory";
import { makeHomePageVariationBModel } from "../HomePageVariationB/factory";

export const makeHomePageModel = (opts: { variation: "a" | "b" }) =>
  Match.value(opts.variation).pipe(
    Match.when("a", () => makeHomePageVariationAModel()),
    Match.when("b", () => makeHomePageVariationBModel()),
    Match.exhaustive,
  );
