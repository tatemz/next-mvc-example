"use server";

import type { HomePageViewModel } from "../components/HomePage/HomePage";
import { searchPerson as searchPersonEffect } from "../controllers/SearchPerson.controller";
import { ghibliRuntime } from "../server/Runtime";

export async function searchGhibliPerson(
  previous: HomePageViewModel,
  formData: FormData,
) {
  return ghibliRuntime.runPromise(searchPersonEffect(previous, formData));
}
