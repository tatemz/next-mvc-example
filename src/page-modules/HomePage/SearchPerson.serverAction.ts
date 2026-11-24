"use server";

import type { HomePageViewModel } from "./HomePage.model";
import { searchPerson as searchPersonEffect } from "./SearchPerson.controller";
import { runtime } from "../../server/Runtime";

export async function searchPerson(
  previous: HomePageViewModel,
  formData: FormData,
): Promise<HomePageViewModel> {
  return runtime.runPromise(searchPersonEffect(previous, formData));
}
