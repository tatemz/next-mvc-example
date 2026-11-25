import { searchGhibliPerson } from "../../actions/GhibliSearchPerson.serverAction";
import { ghibliRuntime } from "../../server/Runtime";
import { makeHomePage } from "./HomePage.factory";

export const GhibliHome = makeHomePage(ghibliRuntime, searchGhibliPerson);
