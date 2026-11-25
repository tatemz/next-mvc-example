import { Effect } from "effect";

export const logUiEvent = (payload: unknown) =>
  Effect.logInfo("ui event").pipe(
    Effect.annotateLogs({ uiEvent: payload }),
  );

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => undefined);
  if (payload === undefined) {
    return new Response("Invalid JSON", { status: 400 });
  }

  await Effect.runPromise(logUiEvent(payload));
  return new Response(null, { status: 204 });
}
