import { Results } from "../../components/Results/Results";
import {
  loadResults,
  type ResultsSearchParams,
} from "../../controllers/Results.controller";
import { swapiRuntime } from "../../server/Runtime";

export async function ResultsPage({
  searchParams,
}: {
  readonly searchParams: ResultsSearchParams;
}) {
  const model = await swapiRuntime.runPromise(loadResults(searchParams));
  return <Results {...model} />;
}
