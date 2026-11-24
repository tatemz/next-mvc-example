import type { I18n } from "../../i18n/I18n.service";
import { SearchFormViewModel } from "./SearchForm.model";

export const makeInitialSearchFormViewModel = (
  i18n: I18n,
  value: string,
) =>
  SearchFormViewModel.make({
    value,
    label: i18n._({ id: "characterId.label" }),
    submitLabel: i18n._({ id: "search.submit" }),
    pendingLabel: i18n._({ id: "search.pending" }),
  });

export const makeRetrySearchFormViewModel = (
  i18n: I18n,
  value: string,
) =>
  SearchFormViewModel.make({
    value,
    label: i18n._({ id: "characterId.label" }),
    submitLabel: i18n._({ id: "search.retry" }),
    pendingLabel: i18n._({ id: "search.pending" }),
  });
