import { Array, Option, Schema } from "effect";
import {
  NoTransportKey,
  type Universe,
} from "../domain/FilmUniverse.model";
import type { I18n } from "../i18n/I18n.service";
import { localeHref } from "../i18n/Locale";
import type { ResultsCta } from "../ui-events/UiEvent";
import {
  AppShell,
  AppShellViewModel,
  makeAppShellViewModel,
} from "./AppShell";
import {
  FilmListItemInput,
  FilmListItemViewModel,
  makeFilmListItemViewModel,
} from "./FilmListItem";
import { ResultsMissingView } from "./ResultsMissingView";
import { ResultsReadyView } from "./ResultsReadyView";
import {
  PersonCardInput,
  PersonViewModel,
  TransportInput,
  TransportViewModel,
  makePersonViewModel,
  makeTransportViewModel,
} from "./PersonCard";

export const ResultsViewModel = Schema.TaggedUnion({
  Ready: {
    shell: AppShellViewModel,
    heading: Schema.NonEmptyString,
    subtitle: Schema.NonEmptyString,
    person: PersonViewModel,
    film: FilmListItemViewModel,
    transport: Schema.NullOr(TransportViewModel),
    filmLabel: Schema.NonEmptyString,
    transportLabel: Schema.NonEmptyString,
    noneLabel: Schema.NonEmptyString,
    startOverLabel: Schema.NonEmptyString,
    homeLabel: Schema.NonEmptyString,
    startOverHref: Schema.NonEmptyString,
    homeHref: Schema.NonEmptyString,
  },
  Missing: {
    shell: AppShellViewModel,
    heading: Schema.NonEmptyString,
    message: Schema.NonEmptyString,
    startOverLabel: Schema.NonEmptyString,
    startOverHref: Schema.NonEmptyString,
  },
});
export type ResultsViewModel = typeof ResultsViewModel.Type;

export const makeResultsReadyViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  person: PersonCardInput,
  film: FilmListItemInput,
  transport: TransportInput | null,
  universe: Universe,
) =>
  ResultsViewModel.cases.Ready.make({
    shell,
    heading: i18n._({ id: "results.ready.heading" }),
    subtitle: i18n._({ id: "results.ready.subtitle" }),
    person: makePersonViewModel(i18n, person),
    film: makeFilmListItemViewModel(film),
    transport: transport === null ? null : makeTransportViewModel(transport),
    filmLabel: i18n._({ id: "results.ready.filmLabel" }),
    transportLabel: i18n._({ id: "results.ready.transportLabel" }),
    noneLabel: i18n._({ id: "results.ready.noneTransport" }),
    startOverLabel: i18n._({ id: "results.ready.startOver" }),
    homeLabel: i18n._({ id: "results.ready.home" }),
    startOverHref: localeHref(i18n.locale, `/${universe}/funnel`),
    homeHref: localeHref(i18n.locale, `/${universe}`),
  });

const missingViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  universe: Universe,
) =>
  ResultsViewModel.cases.Missing.make({
    shell,
    heading: i18n._({ id: "results.missing.heading" }),
    message: i18n._({ id: "results.missing.message" }),
    startOverLabel: i18n._({ id: "results.missing.startOver" }),
    startOverHref: localeHref(i18n.locale, `/${universe}/funnel`),
  });

export const makeResultsMissingViewModel = (
  i18n: I18n,
  universe: Universe,
) =>
  missingViewModel(
    i18n,
    makeAppShellViewModel(i18n, universe),
    universe,
  );

export type ResultsQuery = {
  readonly film: number;
  readonly transport: string;
};

export const makeResultsViewModel = (
  i18n: I18n,
  universe: Universe,
  person: Option.Option<PersonCardInput>,
  query: ResultsQuery,
): ResultsViewModel => {
  const shell = makeAppShellViewModel(i18n, universe);

  if (Option.isNone(person)) {
    return missingViewModel(i18n, shell, universe);
  }

  const film = Array.findFirst(
    person.value.films,
    (candidate) => candidate.order === query.film,
  );

  if (Option.isNone(film)) {
    return missingViewModel(i18n, shell, universe);
  }

  const transport: Option.Option<TransportInput | null> =
    query.transport === NoTransportKey
      ? Option.some(null)
      : Array.findFirst(
        person.value.transports,
        (candidate) => candidate.key === query.transport,
      );

  if (Option.isNone(transport)) {
    return missingViewModel(i18n, shell, universe);
  }

  return makeResultsReadyViewModel(
    i18n,
    shell,
    person.value,
    film.value,
    transport.value,
    universe,
  );
};

export type ResultsViewProps = {
  readonly model: ResultsViewModel;
  readonly onCtaClick: (cta: ResultsCta) => void;
};

export const ResultsView = ({ model, onCtaClick }: ResultsViewProps) => (
  <AppShell {...model.shell}>
    {ResultsViewModel.match(model, {
      Ready: (ready) => (
        <ResultsReadyView model={ready} onCtaClick={onCtaClick} />
      ),
      Missing: (missing) => (
        <ResultsMissingView model={missing} onCtaClick={onCtaClick} />
      ),
    })}
  </AppShell>
);
