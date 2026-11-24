import { ResultsPage } from "../../src/page-modules/Results/Results.page";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  readonly [key: string]: string | string[] | undefined;
}>;

export default async function ResultsRoute({
  searchParams,
}: {
  readonly searchParams: SearchParams;
}) {
  const params = await searchParams;
  return <ResultsPage searchParams={params} />;
}
