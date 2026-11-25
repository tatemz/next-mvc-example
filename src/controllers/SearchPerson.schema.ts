import { Schema, type SchemaIssue } from "effect";
import { CharacterId } from "../domain/FilmUniverse.model";
import {
  FormValidationError,
  validateFormData,
} from "../forms/FormData";

export const SearchFormData = Schema.Struct({
  characterId: CharacterId,
});
export type SearchFormData = typeof SearchFormData.Type;

export type SearchFormMessageId =
  | "search.characterId.required"
  | "search.characterId.invalid";

export type SearchFormFieldErrors = {
  readonly characterId: SearchFormMessageId;
};

const firstIssue = (issue: SchemaIssue.Issue): SchemaIssue.Issue => {
  if (issue._tag === "Composite") return firstIssue(issue.issues[0]);
  if (issue._tag === "Pointer") return firstIssue(issue.issue);
  return issue;
};

export const searchFormErrors = (
  issue: SchemaIssue.Issue,
): SearchFormFieldErrors => ({
  characterId:
    firstIssue(issue)._tag === "MissingKey"
      ? "search.characterId.required"
      : "search.characterId.invalid",
});

export const validateSearchForm = validateFormData(
  SearchFormData,
  searchFormErrors,
);

export type SearchFormValidationError = FormValidationError<SearchFormFieldErrors>;
