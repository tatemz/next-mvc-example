"use server";

import type { HomePageViewModel } from "../components/HomePage/HomePage.model";
import { searchPerson as searchPersonEffect } from "../controllers/SearchPerson.controller";
import { runtime } from "../server/Runtime";

export async function searchPerson(
  previous: HomePageViewModel,
  formData: FormData,
) {
  return runtime.runPromise(searchPersonEffect(previous, formData));
}
