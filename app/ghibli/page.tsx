import { searchGhibliPerson } from "../../src/actions/GhibliSearchPerson.serverAction";
import { makeHomePage } from "../../src/page-modules/HomePage/HomePage.factory";
import { ghibliRuntime } from "../../src/server/Runtime";

export const dynamic = "force-dynamic";

export default makeHomePage(ghibliRuntime, searchGhibliPerson);
