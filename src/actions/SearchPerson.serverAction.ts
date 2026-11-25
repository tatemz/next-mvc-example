"use server";

import type { HomePageViewModel } from "../components/HomePage/HomePage";
import { searchPerson as searchPersonEffect } from "../controllers/SearchPerson.controller";
import { swapiRuntime } from "../server/Runtime";

export async function searchPerson(
  previous: HomePageViewModel,
  formData: FormData,
) {
  return swapiRuntime.runPromise(searchPersonEffect(previous, formData));
}
