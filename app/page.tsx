import { Function } from "effect";
import { makeHomePageModel } from "../src/components/HomePage/factory";
import { HomePage } from "../src/components/HomePage/view";

export const dynamic = "force-dynamic";

const getRandomVariation = (): "a" | "b" =>
  Math.floor(Math.random() * 10) % 2 === 0 ? "a" : "b";

const controller = () => makeHomePageModel({ variation: getRandomVariation() });

const Page = Function.flow(controller, HomePage);

export default Page;
