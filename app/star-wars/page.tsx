import { searchPerson } from "../../src/actions/SearchPerson.serverAction";
import { makeHomePage } from "../../src/page-modules/HomePage/HomePage.factory";
import { swapiRuntime } from "../../src/server/Runtime";

export const dynamic = "force-dynamic";

export default makeHomePage(swapiRuntime, searchPerson);
