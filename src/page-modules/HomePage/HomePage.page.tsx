import { runtime } from "../../server/Runtime";
import { ConnectedHomePage } from "../../components/HomePage/HomePage.connected";
import { loadHomePage } from "../../controllers/HomePage.controller";

export async function HomePage() {
  const model = await runtime.runPromise(loadHomePage);
  return <ConnectedHomePage {...model} />;
}
