import { Match, Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import { FilmListItemViewModel } from "../FilmListItem/FilmListItem";
import {
  PersonCard,
  PersonViewModel,
  TransportViewModel,
} from "../PersonCard/PersonCard";

export const ResultsReadyViewModel = Schema.TaggedStruct("Ready", {
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
});
export type ResultsReadyViewModel = typeof ResultsReadyViewModel.Type;

export const ResultsMissingViewModel = Schema.TaggedStruct("Missing", {
  heading: Schema.NonEmptyString,
  message: Schema.NonEmptyString,
  startOverLabel: Schema.NonEmptyString,
  startOverHref: Schema.NonEmptyString,
});
export type ResultsMissingViewModel = typeof ResultsMissingViewModel.Type;

export const ResultsViewModel = Schema.Union([
  ResultsReadyViewModel,
  ResultsMissingViewModel,
]);
export type ResultsViewModel = typeof ResultsViewModel.Type;

export const makeResultsReadyViewModel = (
  i18n: I18n,
  person: PersonViewModel,
  film: FilmListItemViewModel,
  transport: TransportViewModel | null,
) =>
  ResultsReadyViewModel.make({
    heading: i18n._({ id: "results.ready.heading" }),
    subtitle: i18n._({ id: "results.ready.subtitle" }),
    person,
    film,
    transport,
    filmLabel: i18n._({ id: "results.ready.filmLabel" }),
    transportLabel: i18n._({ id: "results.ready.transportLabel" }),
    noneLabel: i18n._({ id: "results.ready.noneTransport" }),
    startOverLabel: i18n._({ id: "results.ready.startOver" }),
    homeLabel: i18n._({ id: "results.ready.home" }),
    startOverHref: "/star-wars/funnel",
    homeHref: "/star-wars",
  });

export const makeResultsMissingViewModel = (i18n: I18n) =>
  ResultsMissingViewModel.make({
    heading: i18n._({ id: "results.missing.heading" }),
    message: i18n._({ id: "results.missing.message" }),
    startOverLabel: i18n._({ id: "results.missing.startOver" }),
    startOverHref: "/star-wars/funnel",
  });

const ReadyResults = ({ model }: { readonly model: ResultsReadyViewModel }) => (
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
      <a href={model.startOverHref} className="btn btn-primary">
        {model.startOverLabel}
      </a>
      <a href={model.homeHref} className="btn btn-ghost">
        {model.homeLabel}
      </a>
    </div>
  </div>
);

const MissingResults = ({
  model,
}: {
  readonly model: ResultsMissingViewModel;
}) => (
  <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold">{model.heading}</h1>
    <div role="alert" className="alert alert-error">
      {model.message}
    </div>
    <a href={model.startOverHref} className="btn btn-primary">
      {model.startOverLabel}
    </a>
  </div>
);

export const Results = (model: ResultsViewModel) =>
  Match.value(model).pipe(
    Match.tag("Ready", (ready) => <ReadyResults model={ready} />),
    Match.tag("Missing", (missing) => <MissingResults model={missing} />),
    Match.exhaustive,
  );
