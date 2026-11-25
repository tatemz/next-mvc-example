import { ghibliRuntime } from "../../server/Runtime";
import { makeResultsPage } from "./Results.factory";

export const GhibliResultsPage = makeResultsPage(
  ghibliRuntime,
  "/ghibli",
);
