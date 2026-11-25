import { Array, Option, Schema } from "effect";
import type { Universe } from "../domain/FilmUniverse.model";
import type { I18n } from "../i18n/I18n.service";
import type { ResultsCta } from "../ui-events/UiEvent";
import { AppShell, AppShellViewModel } from "./AppShell";
import {
  FilmListItemInput,
  FilmListItemViewModel,
  makeFilmListItemViewModel,
} from "./FilmListItem";
import {
  PersonCard,
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

type ResultsReadyViewModel = typeof ResultsViewModel.cases.Ready.Type;
type ResultsMissingViewModel = typeof ResultsViewModel.cases.Missing.Type;

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
    startOverHref: `/${universe}/funnel`,
    homeHref: `/${universe}`,
  });

export const makeResultsMissingViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  universe: Universe,
) =>
  ResultsViewModel.cases.Missing.make({
    shell,
    heading: i18n._({ id: "results.missing.heading" }),
    message: i18n._({ id: "results.missing.message" }),
    startOverLabel: i18n._({ id: "results.missing.startOver" }),
    startOverHref: `/${universe}/funnel`,
  });

export const makeResultsViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  universe: Universe,
  person: Option.Option<PersonCardInput>,
  filmOrder: number,
  transportKey: string,
): ResultsViewModel => {
  if (Option.isNone(person)) {
    return makeResultsMissingViewModel(i18n, shell, universe);
  }

  const film = Array.findFirst(
    person.value.films,
    (candidate) => candidate.order === filmOrder,
  );

  if (Option.isNone(film)) {
    return makeResultsMissingViewModel(i18n, shell, universe);
  }

  const transport = transportKey === "none"
    ? null
    : Option.getOrNull(
      Array.findFirst(
        person.value.transports,
        (candidate) => candidate.key === transportKey,
      ),
    );

  if (transportKey !== "none" && transport === null) {
    return makeResultsMissingViewModel(i18n, shell, universe);
  }

  return makeResultsReadyViewModel(
    i18n,
    shell,
    person.value,
    film.value,
    transport,
    universe,
  );
};

export type ResultsViewProps = {
  readonly model: ResultsViewModel;
  readonly onCtaClick: (cta: ResultsCta) => void;
};

const ReadyResults = ({
  model,
  onCtaClick,
}: {
  readonly model: ResultsReadyViewModel;
  readonly onCtaClick: (cta: ResultsCta) => void;
}) => (
  <div className="flex flex-col gap-6">
    <section className="hero rounded-box bg-base-100 shadow-xl">
      <div className="hero-content py-8 text-center">
        <div>
          <h1 className="text-4xl font-bold">{model.heading}</h1>
          <p className="py-3 text-base-content/70">{model.subtitle}</p>
        </div>
      </div>
    </section>
    <PersonCard {...model.person} />
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{model.filmLabel}</h2>
          {model.film.imageUrl === undefined ? null : (
            <img
              src={model.film.imageUrl}
              alt=""
              className="mb-3 h-40 w-28 rounded-box object-cover"
              loading="lazy"
            />
          )}
          <p className="text-lg">{model.film.text}</p>
        </div>
      </section>
      <section className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{model.transportLabel}</h2>
          <p className="text-lg">
            {model.transport === null
              ? model.noneLabel
              : `${model.transport.name} (${model.transport.kind})`}
          </p>
        </div>
      </section>
    </div>
    <div className="flex flex-wrap gap-3">
      <a
        href={model.startOverHref}
        onClick={() => onCtaClick("build_another_dossier")}
        className="btn btn-primary"
      >
        {model.startOverLabel}
      </a>
      <a
        href={model.homeHref}
        onClick={() => onCtaClick("back_home")}
        className="btn btn-ghost"
      >
        {model.homeLabel}
      </a>
    </div>
  </div>
);

const MissingResults = ({
  model,
  onCtaClick,
}: {
  readonly model: ResultsMissingViewModel;
  readonly onCtaClick: (cta: "build_another_dossier") => void;
}) => (
  <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold">{model.heading}</h1>
    <div role="alert" className="alert alert-error">
      {model.message}
    </div>
    <a
      href={model.startOverHref}
      onClick={() => onCtaClick("build_another_dossier")}
      className="btn btn-primary"
    >
      {model.startOverLabel}
    </a>
  </div>
);

export const ResultsView = ({ model, onCtaClick }: ResultsViewProps) => (
  <AppShell {...model.shell}>
    {ResultsViewModel.match(model, {
      Ready: (ready) => (
        <ReadyResults model={ready} onCtaClick={onCtaClick} />
      ),
      Missing: (missing) => (
        <MissingResults model={missing} onCtaClick={onCtaClick} />
      ),
    })}
  </AppShell>
);
