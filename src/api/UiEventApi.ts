import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/http-api";
import { UiEventPayload } from "../ui-events/UiEventHandler";

export const UiEventApi = HttpApi.make("UiEventApi").add(
  HttpApiGroup.make("UiEvents").add(
    HttpApiEndpoint.post("Ingest", "/api/ui-events", {
      payload: UiEventPayload,
    }),
  ),
);
