"use server";

import type { HomePageViewModel } from "../components/HomePage/model";
import { searchPerson as searchPersonEffect } from "../controllers/searchPerson.controller";
import { runtime } from "../server/runtime";

export async function searchPerson(
  previous: HomePageViewModel,
  formData: FormData,
): Promise<HomePageViewModel> {
  return runtime.runPromise(searchPersonEffect(previous, formData));
}
