import { swapiRuntime } from "../../server/Runtime";
import { makeResultsPage } from "./Results.factory";

export const StarWarsResultsPage = makeResultsPage(
  swapiRuntime,
  "/star-wars",
);
