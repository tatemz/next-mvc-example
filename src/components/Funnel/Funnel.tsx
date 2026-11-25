import { Match, Schema } from "effect";
import type { ReactNode } from "react";
import type { I18n } from "../../i18n/I18n.service";
import { FilmListItemViewModel } from "../FilmListItem/FilmListItem";
import {
  PersonViewModel,
  TransportViewModel,
} from "../PersonCard/PersonCard";

export const PersonChoiceViewModel = Schema.TaggedStruct(
  "PersonChoiceViewModel",
  {
    id: Schema.String,
    name: Schema.NonEmptyString,
  },
);
export type PersonChoiceViewModel = typeof PersonChoiceViewModel.Type;

const StepCopy = {
  stepLabel: Schema.NonEmptyString,
  heading: Schema.NonEmptyString,
  subtitle: Schema.NonEmptyString,
};

export const FunnelSearchViewModel = Schema.TaggedStruct("Search", {
  ...StepCopy,
  query: Schema.String,
  label: Schema.NonEmptyString,
  placeholder: Schema.NonEmptyString,
  submitLabel: Schema.NonEmptyString,
  pendingLabel: Schema.NonEmptyString,
  error: Schema.optional(Schema.String),
});
export type FunnelSearchViewModel = typeof FunnelSearchViewModel.Type;

export const FunnelChooseViewModel = Schema.TaggedStruct("Choose", {
  ...StepCopy,
  query: Schema.NonEmptyString,
  results: Schema.NonEmptyArray(PersonChoiceViewModel),
  submitLabel: Schema.NonEmptyString,
  pendingLabel: Schema.NonEmptyString,
});
export type FunnelChooseViewModel = typeof FunnelChooseViewModel.Type;

export const FunnelFilmViewModel = Schema.TaggedStruct("Film", {
  ...StepCopy,
  person: PersonViewModel,
  submitLabel: Schema.NonEmptyString,
  pendingLabel: Schema.NonEmptyString,
});
export type FunnelFilmViewModel = typeof FunnelFilmViewModel.Type;

export const FunnelTransportViewModel = Schema.TaggedStruct("Transport", {
  ...StepCopy,
  person: PersonViewModel,
  film: FilmListItemViewModel,
  submitLabel: Schema.NonEmptyString,
  pendingLabel: Schema.NonEmptyString,
  noneLabel: Schema.NonEmptyString,
});
export type FunnelTransportViewModel = typeof FunnelTransportViewModel.Type;

export const FunnelReviewViewModel = Schema.TaggedStruct("Review", {
  ...StepCopy,
  person: PersonViewModel,
  film: FilmListItemViewModel,
  transport: Schema.NullOr(TransportViewModel),
  filmLabel: Schema.NonEmptyString,
  transportLabel: Schema.NonEmptyString,
  noneLabel: Schema.NonEmptyString,
  openLabel: Schema.NonEmptyString,
  startOverLabel: Schema.NonEmptyString,
  startOverHref: Schema.NonEmptyString,
  resultsHref: Schema.NonEmptyString,
});
export type FunnelReviewViewModel = typeof FunnelReviewViewModel.Type;

export const FunnelFailedViewModel = Schema.TaggedStruct("Failed", {
  ...StepCopy,
  message: Schema.NonEmptyString,
  startOverLabel: Schema.NonEmptyString,
  startOverHref: Schema.NonEmptyString,
});
export type FunnelFailedViewModel = typeof FunnelFailedViewModel.Type;

export const FunnelViewModel = Schema.Union([
  FunnelSearchViewModel,
  FunnelChooseViewModel,
  FunnelFilmViewModel,
  FunnelTransportViewModel,
  FunnelReviewViewModel,
  FunnelFailedViewModel,
]);
export type FunnelViewModel = typeof FunnelViewModel.Type;

export const makeFunnelSearchViewModel = (
  i18n: I18n,
  query = "",
  error?: string,
) =>
  FunnelSearchViewModel.make({
    stepLabel: i18n._({ id: "funnel.step.search" }),
    heading: i18n._({ id: "funnel.search.heading" }),
    subtitle: i18n._({ id: "funnel.search.subtitle" }),
    query,
    label: i18n._({ id: "funnel.search.label" }),
    placeholder: i18n._({ id: "funnel.search.placeholder" }),
    submitLabel: i18n._({ id: "funnel.search.submit" }),
    pendingLabel: i18n._({ id: "funnel.pending" }),
    ...(error === undefined ? {} : { error }),
  });

export const makeFunnelChooseViewModel = (
  i18n: I18n,
  query: string,
  results: readonly [
    PersonChoiceViewModel,
    ...PersonChoiceViewModel[],
  ],
) =>
  FunnelChooseViewModel.make({
    stepLabel: i18n._({ id: "funnel.step.choose" }),
    heading: i18n._({ id: "funnel.choose.heading" }),
    subtitle: i18n._({ id: "funnel.choose.subtitle" }),
    query,
    results,
    submitLabel: i18n._({ id: "funnel.choose.submit" }),
    pendingLabel: i18n._({ id: "funnel.pending" }),
  });

export const makeFunnelFilmViewModel = (
  i18n: I18n,
  person: PersonViewModel,
) =>
  FunnelFilmViewModel.make({
    stepLabel: i18n._({ id: "funnel.step.film" }),
    heading: i18n._({ id: "funnel.film.heading" }),
    subtitle: i18n._({ id: "funnel.film.subtitle" }),
    person,
    submitLabel: i18n._({ id: "funnel.film.submit" }),
    pendingLabel: i18n._({ id: "funnel.pending" }),
  });

export const makeFunnelTransportViewModel = (
  i18n: I18n,
  person: PersonViewModel,
  film: FilmListItemViewModel,
) =>
  FunnelTransportViewModel.make({
    stepLabel: i18n._({ id: "funnel.step.transport" }),
    heading: i18n._({ id: "funnel.transport.heading" }),
    subtitle: i18n._({ id: "funnel.transport.subtitle" }),
    person,
    film,
    submitLabel: i18n._({ id: "funnel.transport.submit" }),
    pendingLabel: i18n._({ id: "funnel.pending" }),
    noneLabel: i18n._({ id: "funnel.transport.none" }),
  });

export const makeFunnelReviewViewModel = (
  i18n: I18n,
  person: PersonViewModel,
  film: FilmListItemViewModel,
  transport: TransportViewModel | null,
) => {
  const params = new URLSearchParams({
    character: person.id,
    film: String(film.order),
    transport: transport?.key ?? "none",
  });

  return FunnelReviewViewModel.make({
    stepLabel: i18n._({ id: "funnel.step.review" }),
    heading: i18n._({ id: "funnel.review.heading" }),
    subtitle: i18n._({ id: "funnel.review.subtitle" }),
    person,
    film,
    transport,
    filmLabel: i18n._({ id: "funnel.review.film" }),
    transportLabel: i18n._({ id: "funnel.review.transport" }),
    noneLabel: i18n._({ id: "funnel.transport.none" }),
    openLabel: i18n._({ id: "funnel.review.open" }),
    startOverLabel: i18n._({ id: "funnel.review.startOver" }),
    startOverHref: "funnel",
    resultsHref: `results?${params.toString()}`,
  });
};

export const makeFunnelFailedViewModel = (
  i18n: I18n,
  message: string,
) =>
  FunnelFailedViewModel.make({
    stepLabel: i18n._({ id: "funnel.step.failed" }),
    heading: i18n._({ id: "funnel.failed.heading" }),
    subtitle: i18n._({ id: "funnel.failed.message" }),
    message,
    startOverLabel: i18n._({ id: "funnel.failed.startOver" }),
    startOverHref: "funnel",
  });

type FunnelExtras = {
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
};

export type FunnelProps = FunnelViewModel & FunnelExtras;

type StepShellProps = {
  readonly step: {
    readonly stepLabel: string;
    readonly heading: string;
    readonly subtitle: string;
  };
  readonly children: ReactNode;
};

const StepShell = ({ step, children }: StepShellProps) => (
  <section className="card bg-base-100 shadow-xl">
    <div className="card-body gap-4">
      <span className="badge badge-secondary">{step.stepLabel}</span>
      <h1 className="card-title text-3xl">{step.heading}</h1>
      <p className="text-base-content/70">{step.subtitle}</p>
      {children}
    </div>
  </section>
);

type StepProps<T> = {
  readonly step: T;
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
};

const SearchStep = ({
  step,
  dispatch,
  isPending,
}: StepProps<FunnelSearchViewModel>) => (
  <StepShell step={step}>
    <form action={dispatch} className="flex flex-col gap-3">
      <label htmlFor="funnel-query" className="label-text">
        {step.label}
      </label>
      <input
        id="funnel-query"
        name="query"
        defaultValue={step.query}
        placeholder={step.placeholder}
        className={`input input-bordered w-full${
          step.error === undefined ? "" : " input-error"
        }`}
        aria-invalid={step.error !== undefined}
        aria-describedby={
          step.error === undefined ? undefined : "funnel-query-error"
        }
      />
      {step.error === undefined ? null : (
        <p id="funnel-query-error" role="alert" className="text-sm text-error">
          {step.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? step.pendingLabel : step.submitLabel}
      </button>
    </form>
  </StepShell>
);

const ChooseStep = ({
  step,
  dispatch,
  isPending,
}: StepProps<FunnelChooseViewModel>) => (
  <StepShell step={step}>
    <form action={dispatch} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {step.results.map((result) => (
          <label
            key={result.id}
            className="flex cursor-pointer items-center gap-3 rounded-box bg-base-200 p-4"
          >
            <input
              type="radio"
              name="characterId"
              value={result.id}
              className="radio radio-primary"
              required
            />
            <span className="font-semibold">{result.name}</span>
          </label>
        ))}
      </div>
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? step.pendingLabel : step.submitLabel}
      </button>
    </form>
  </StepShell>
);

const FilmStep = ({
  step,
  dispatch,
  isPending,
}: StepProps<FunnelFilmViewModel>) => (
  <StepShell step={step}>
    <form action={dispatch} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {step.person.films.map((film) => (
          <label
            key={film.order}
            className="flex cursor-pointer items-center gap-3 rounded-box bg-base-200 p-4"
          >
            <input
              type="radio"
              name="order"
              value={film.order}
              className="radio radio-primary"
              required
            />
            <span className="font-semibold">{film.text}</span>
          </label>
        ))}
      </div>
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? step.pendingLabel : step.submitLabel}
      </button>
    </form>
  </StepShell>
);

const TransportStep = ({
  step,
  dispatch,
  isPending,
}: StepProps<FunnelTransportViewModel>) => (
  <StepShell step={step}>
    <form action={dispatch} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {step.person.transports.map((transport) => (
          <label
            key={transport.key}
            className="flex cursor-pointer items-center gap-3 rounded-box bg-base-200 p-4"
          >
            <input
              type="radio"
              name="transportKey"
              value={transport.key}
              className="radio radio-primary"
              required
            />
            <span className="font-semibold">{transport.name}</span>
            <span className="badge badge-ghost">{transport.kind}</span>
          </label>
        ))}
        <label className="flex cursor-pointer items-center gap-3 rounded-box bg-base-200 p-4">
          <input
            type="radio"
            name="transportKey"
            value="none"
            defaultChecked={step.person.transports.length === 0}
            className="radio radio-primary"
            required
          />
          <span className="font-semibold">{step.noneLabel}</span>
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? step.pendingLabel : step.submitLabel}
      </button>
    </form>
  </StepShell>
);

const ReviewStep = ({ step }: { readonly step: FunnelReviewViewModel }) => (
  <StepShell step={step}>
    <div className="rounded-box bg-base-200 p-4">
      <h2 className="text-xl font-bold">{step.person.name}</h2>
      <p className="text-base-content/70">
        {step.person.origin.name} ·{" "}
        {step.person.species?.name ?? step.person.speciesUnknownLabel}
      </p>
    </div>
    <dl className="grid gap-3 sm:grid-cols-2">
      <div>
        <dt className="text-xs uppercase tracking-wide opacity-60">
          {step.filmLabel}
        </dt>
        <dd className="text-lg">{step.film.text}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide opacity-60">
          {step.transportLabel}
        </dt>
        <dd className="text-lg">
          {step.transport === null
            ? step.noneLabel
            : `${step.transport.name} (${step.transport.kind})`}
        </dd>
      </div>
    </dl>
    <div className="flex flex-wrap gap-3">
      <a href={step.resultsHref} className="btn btn-primary">
        {step.openLabel}
      </a>
      <a href={step.startOverHref} className="btn btn-ghost">
        {step.startOverLabel}
      </a>
    </div>
  </StepShell>
);

const FailedStep = ({ step }: { readonly step: FunnelFailedViewModel }) => (
  <StepShell step={step}>
    <div role="alert" className="alert alert-error">
      {step.message}
    </div>
    <a href={step.startOverHref} className="btn btn-primary">
      {step.startOverLabel}
    </a>
  </StepShell>
);

export const Funnel = ({
  dispatch,
  isPending,
  ...model
}: FunnelProps) =>
  Match.value(model).pipe(
    Match.tag("Search", (step) => (
      <SearchStep step={step} dispatch={dispatch} isPending={isPending} />
    )),
    Match.tag("Choose", (step) => (
      <ChooseStep step={step} dispatch={dispatch} isPending={isPending} />
    )),
    Match.tag("Film", (step) => (
      <FilmStep step={step} dispatch={dispatch} isPending={isPending} />
    )),
    Match.tag("Transport", (step) => (
      <TransportStep step={step} dispatch={dispatch} isPending={isPending} />
    )),
    Match.tag("Review", (step) => <ReviewStep step={step} />),
    Match.tag("Failed", (step) => <FailedStep step={step} />),
    Match.exhaustive,
  );
