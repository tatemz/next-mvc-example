import { ConnectedHomePage } from "../src/components/HomePage/HomePage.connected.view";
import { loadHomePage } from "../src/controllers/homePage.controller";
import { runtime } from "../src/server/runtime";

export const dynamic = "force-dynamic";

export default async function Page() {
  const model = await runtime.runPromise(loadHomePage);
  return <ConnectedHomePage model={model} />;
}
