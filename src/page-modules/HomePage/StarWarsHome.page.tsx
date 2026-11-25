import { searchPerson } from "../../actions/SearchPerson.serverAction";
import { swapiRuntime } from "../../server/Runtime";
import { makeHomePage } from "./HomePage.factory";

export const StarWarsHome = makeHomePage(
  swapiRuntime,
  searchPerson,
  "/star-wars/funnel",
);
