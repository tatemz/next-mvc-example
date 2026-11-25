import { Array, Option, Schema } from "effect";
import type { ReactNode } from "react";
import type { I18n } from "../i18n/I18n.service";
import type { FunnelCta } from "../ui-events/UiEvent";
import type {
  FunnelChooseForm,
  FunnelFilmForm,
  FunnelSearchForm,
  FunnelTransportForm,
} from "../forms/FunnelForm";
import {
  AppShell,
  AppShellViewModel,
  makeAppShellViewModel,
} from "./AppShell";
import type { Universe } from "../domain/FilmUniverse.model";
import { FilmListItemViewModel } from "./FilmListItem";
import {
  PersonCardInput,
  PersonViewModel,
  TransportViewModel,
  makePersonViewModel,
} from "./PersonCard";

export const PersonChoiceViewModel = Schema.TaggedStruct(
  "PersonChoiceViewModel",
  {
    id: Schema.String,
    name: Schema.NonEmptyString,
  },
);
export type PersonChoiceViewModel = typeof PersonChoiceViewModel.Type;

type PersonChoiceInput = {
  readonly id: string;
  readonly name: string;
};

type FunnelSearchInput = {
  readonly form: Option.Option<FunnelSearchForm>;
  readonly results: Option.Option<readonly PersonChoiceInput[]>;
};

type FunnelChooseInput = {
  readonly form: Option.Option<FunnelChooseForm>;
  readonly person: Option.Option<PersonCardInput>;
};

type FunnelFilmInput = {
  readonly form: Option.Option<FunnelFilmForm>;
};

type FunnelTransportInput = {
  readonly form: Option.Option<FunnelTransportForm>;
};

const StepCopy = {
  shell: AppShellViewModel,
  stepLabel: Schema.NonEmptyString,
  heading: Schema.NonEmptyString,
  subtitle: Schema.NonEmptyString,
};

export const FunnelViewModel = Schema.TaggedUnion({
  Search: {
    ...StepCopy,
    query: Schema.String,
    label: Schema.NonEmptyString,
    placeholder: Schema.NonEmptyString,
    submitLabel: Schema.NonEmptyString,
    pendingLabel: Schema.NonEmptyString,
    error: Schema.optional(Schema.String),
  },
  Choose: {
    ...StepCopy,
    query: Schema.NonEmptyString,
    results: Schema.NonEmptyArray(PersonChoiceViewModel),
    submitLabel: Schema.NonEmptyString,
    pendingLabel: Schema.NonEmptyString,
  },
  Film: {
    ...StepCopy,
    person: PersonViewModel,
    submitLabel: Schema.NonEmptyString,
    pendingLabel: Schema.NonEmptyString,
  },
  Transport: {
    ...StepCopy,
    person: PersonViewModel,
    film: FilmListItemViewModel,
    submitLabel: Schema.NonEmptyString,
    pendingLabel: Schema.NonEmptyString,
    noneLabel: Schema.NonEmptyString,
  },
  Review: {
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
  },
  Failed: {
    ...StepCopy,
    message: Schema.NonEmptyString,
    startOverLabel: Schema.NonEmptyString,
    startOverHref: Schema.NonEmptyString,
  },
});
export type FunnelViewModel = typeof FunnelViewModel.Type;

type FunnelSearchViewModel = typeof FunnelViewModel.cases.Search.Type;
type FunnelChooseViewModel = typeof FunnelViewModel.cases.Choose.Type;
type FunnelFilmViewModel = typeof FunnelViewModel.cases.Film.Type;
type FunnelTransportViewModel = typeof FunnelViewModel.cases.Transport.Type;
type FunnelReviewViewModel = typeof FunnelViewModel.cases.Review.Type;
type FunnelFailedViewModel = typeof FunnelViewModel.cases.Failed.Type;

const searchViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  query: string,
  error: string | undefined,
) =>
  FunnelViewModel.cases.Search.make({
    shell,
    stepLabel: i18n._({
      id: "funnel.step.progress",
      values: { step: 1, total: 4 },
    }),
    heading: i18n._({ id: "funnel.search.heading" }),
    subtitle: i18n._({ id: "funnel.search.subtitle" }),
    query,
    label: i18n._({ id: "funnel.search.label" }),
    placeholder: i18n._({ id: "funnel.search.placeholder" }),
    submitLabel: i18n._({ id: "funnel.search.submit" }),
    pendingLabel: i18n._({ id: "funnel.pending" }),
    ...(error === undefined ? {} : { error }),
  });

export const makeFunnelSearchViewModel = (
  i18n: I18n,
  universe: Universe,
  query: string,
  error: string | undefined,
) =>
  searchViewModel(
    i18n,
    makeAppShellViewModel(i18n, universe),
    query,
    error,
  );

export const makeFunnelChooseViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  query: string,
  results: readonly [PersonChoiceInput, ...PersonChoiceInput[]],
) => {
  const [first, ...rest] = results;

  return FunnelViewModel.cases.Choose.make({
    shell,
    stepLabel: i18n._({
      id: "funnel.step.progress",
      values: { step: 2, total: 4 },
    }),
    heading: i18n._({ id: "funnel.choose.heading" }),
    subtitle: i18n._({
      id: "funnel.choose.subtitle",
      values: { count: results.length },
    }),
    query,
    results: [
      PersonChoiceViewModel.make({ id: first.id, name: first.name }),
      ...Array.map(rest, (person) =>
        PersonChoiceViewModel.make({ id: person.id, name: person.name })
      ),
    ],
    submitLabel: i18n._({ id: "funnel.choose.submit" }),
    pendingLabel: i18n._({ id: "funnel.pending" }),
  });
};

export const makeFunnelFilmViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  person: PersonCardInput,
) =>
  FunnelViewModel.cases.Film.make({
    shell,
    stepLabel: i18n._({
      id: "funnel.step.progress",
      values: { step: 3, total: 4 },
    }),
    heading: i18n._({ id: "funnel.film.heading" }),
    subtitle: i18n._({ id: "funnel.film.subtitle" }),
    person: makePersonViewModel(i18n, person),
    submitLabel: i18n._({ id: "funnel.film.submit" }),
    pendingLabel: i18n._({ id: "funnel.pending" }),
  });

export const makeFunnelTransportViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  person: PersonViewModel,
  film: FilmListItemViewModel,
) =>
  FunnelViewModel.cases.Transport.make({
    shell,
    stepLabel: i18n._({
      id: "funnel.step.progress",
      values: { step: 4, total: 4 },
    }),
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
  shell: AppShellViewModel,
  person: PersonViewModel,
  film: FilmListItemViewModel,
  transport: TransportViewModel | null,
) => {
  const params = new URLSearchParams({
    character: person.id,
    film: String(film.order),
    transport: Option.match(Option.fromNullishOr(transport), {
      onNone: () => "none",
      onSome: (selected) => selected.key,
    }),
  });

  return FunnelViewModel.cases.Review.make({
    shell,
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

export type FunnelFailure = "unavailable" | "invalidChoice";

const failureMessage = (i18n: I18n, failure: FunnelFailure): string =>
  failure === "unavailable"
    ? i18n._({ id: "funnel.failed.message" })
    : i18n._({ id: "funnel.failed.invalidChoice" });

export const makeFunnelFailedViewModel = (
  i18n: I18n,
  shell: AppShellViewModel,
  failure: FunnelFailure,
) =>
  FunnelViewModel.cases.Failed.make({
    shell,
    stepLabel: i18n._({ id: "funnel.step.failed" }),
    heading: i18n._({ id: "funnel.failed.heading" }),
    subtitle: i18n._({ id: "funnel.failed.subtitle" }),
    message: failureMessage(i18n, failure),
    startOverLabel: i18n._({ id: "funnel.failed.startOver" }),
    startOverHref: "funnel",
  });

const isAvailableChoice = (
  step: FunnelChooseViewModel,
  characterId: string,
): boolean =>
  Array.some(step.results, (result) => result.id === characterId);

export const makeFunnelSearchResult = (
  i18n: I18n,
  step: FunnelSearchViewModel,
  input: FunnelSearchInput,
): FunnelViewModel => {
  if (Option.isNone(input.form)) {
    return searchViewModel(
      i18n,
      step.shell,
      "",
      i18n._({ id: "funnel.search.required" }),
    );
  }

  const form = input.form.value;

  if (Option.isNone(input.results)) {
    return makeFunnelFailedViewModel(i18n, step.shell, "unavailable");
  }

  return Array.matchLeft(input.results.value, {
    onEmpty: () =>
      searchViewModel(
        i18n,
        step.shell,
        form.query,
        i18n._({ id: "funnel.search.noResults" }),
      ),
    onNonEmpty: (first, rest) =>
      makeFunnelChooseViewModel(
        i18n,
        step.shell,
        form.query,
        [first, ...rest],
      ),
  });
};

export const makeFunnelChooseResult = (
  i18n: I18n,
  step: FunnelChooseViewModel,
  input: FunnelChooseInput,
): FunnelViewModel => {
  if (
    Option.isNone(input.form) ||
    !isAvailableChoice(step, input.form.value.characterId)
  ) {
    return makeFunnelFailedViewModel(i18n, step.shell, "invalidChoice");
  }

  if (Option.isNone(input.person)) {
    return makeFunnelFailedViewModel(i18n, step.shell, "unavailable");
  }

  return makeFunnelFilmViewModel(i18n, step.shell, input.person.value);
};

export const makeFunnelFilmResult = (
  i18n: I18n,
  step: FunnelFilmViewModel,
  input: FunnelFilmInput,
): FunnelViewModel => {
  const film = Option.flatMap(input.form, ({ order }) =>
    Array.findFirst(
      step.person.films,
      (candidate) => candidate.order === order,
    )
  );

  if (Option.isNone(film)) {
    return makeFunnelFailedViewModel(i18n, step.shell, "invalidChoice");
  }

  return makeFunnelTransportViewModel(
    i18n,
    step.shell,
    step.person,
    film.value,
  );
};

export const makeFunnelTransportResult = (
  i18n: I18n,
  step: FunnelTransportViewModel,
  input: FunnelTransportInput,
): FunnelViewModel => {
  if (Option.isNone(input.form)) {
    return makeFunnelFailedViewModel(i18n, step.shell, "invalidChoice");
  }

  const { transportKey } = input.form.value;
  const transport = transportKey === "none"
    ? Option.none<TransportViewModel>()
    : Array.findFirst(
      step.person.transports,
      (candidate) => candidate.key === transportKey,
    );

  if (transportKey !== "none" && Option.isNone(transport)) {
    return makeFunnelFailedViewModel(i18n, step.shell, "invalidChoice");
  }

  return makeFunnelReviewViewModel(
    i18n,
    step.shell,
    step.person,
    step.film,
    Option.getOrNull(transport),
  );
};

type FunnelExtras = {
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
  readonly onCtaClick: (cta: FunnelCta) => void;
  readonly onQueryChange: (value: string) => void;
};

export type FunnelViewProps = FunnelExtras & {
  readonly model: FunnelViewModel;
};

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

type StepProps<T, Cta extends FunnelCta = FunnelCta> = {
  readonly step: T;
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
  readonly onCtaClick: (cta: Cta) => void;
};

type SearchStepProps = StepProps<FunnelSearchViewModel, "search"> & {
  readonly onQueryChange: (value: string) => void;
};

const SearchStep = ({
  step,
  dispatch,
  isPending,
  onCtaClick,
  onQueryChange,
}: SearchStepProps) => (
  <StepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick("search")}
      className="flex flex-col gap-3"
    >
      <label htmlFor="funnel-query" className="label-text">
        {step.label}
      </label>
      <input
        id="funnel-query"
        name="query"
        defaultValue={step.query}
        onChange={(event) => onQueryChange(event.currentTarget.value)}
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
  onCtaClick,
}: StepProps<FunnelChooseViewModel, "choose_character">) => (
  <StepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick("choose_character")}
      className="flex flex-col gap-3"
    >
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
  onCtaClick,
}: StepProps<FunnelFilmViewModel, "next_transport">) => (
  <StepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick("next_transport")}
      className="flex flex-col gap-3"
    >
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
            {film.imageUrl === undefined ? null : (
              <img
                src={film.imageUrl}
                alt=""
                className="h-16 w-12 rounded object-cover"
                loading="lazy"
              />
            )}
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
  onCtaClick,
}: StepProps<FunnelTransportViewModel, "review_dossier">) => (
  <StepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick("review_dossier")}
      className="flex flex-col gap-3"
    >
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

const ReviewStep = ({
  step,
  onCtaClick,
}: {
  readonly step: FunnelReviewViewModel;
  readonly onCtaClick: (cta: "open_dossier" | "start_over") => void;
}) => (
  <StepShell step={step}>
    <div className="rounded-box bg-base-200 p-4">
      <h2 className="text-xl font-bold">{step.person.name}</h2>
      <p className="text-base-content/70">
        {step.person.origin.name} ·{" "}
        {Option.match(Option.fromNullishOr(step.person.species), {
          onNone: () => step.person.speciesUnknownLabel,
          onSome: (species) => species.name,
        })}
      </p>
    </div>
    <dl className="grid gap-3 sm:grid-cols-2">
      <div>
        <dt className="text-xs uppercase tracking-wide opacity-60">
          {step.filmLabel}
        </dt>
        {step.film.imageUrl === undefined ? null : (
          <img
            src={step.film.imageUrl}
            alt=""
            className="my-2 h-28 w-20 rounded object-cover"
            loading="lazy"
          />
        )}
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
      <a
        href={step.resultsHref}
        onClick={() => onCtaClick("open_dossier")}
        className="btn btn-primary"
      >
        {step.openLabel}
      </a>
      <a
        href={step.startOverHref}
        onClick={() => onCtaClick("start_over")}
        className="btn btn-ghost"
      >
        {step.startOverLabel}
      </a>
    </div>
  </StepShell>
);

const FailedStep = ({
  step,
  onCtaClick,
}: {
  readonly step: FunnelFailedViewModel;
  readonly onCtaClick: (cta: "start_over") => void;
}) => (
  <StepShell step={step}>
    <div role="alert" className="alert alert-error">
      {step.message}
    </div>
    <a
      href={step.startOverHref}
      onClick={() => onCtaClick("start_over")}
      className="btn btn-primary"
    >
      {step.startOverLabel}
    </a>
  </StepShell>
);

export const FunnelView = ({
  dispatch,
  isPending,
  model,
  onCtaClick,
  onQueryChange,
}: FunnelViewProps) => (
  <AppShell {...model.shell}>
    {FunnelViewModel.match(model, {
      Search: (step) => (
        <SearchStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
          onQueryChange={onQueryChange}
        />
      ),
      Choose: (step) => (
        <ChooseStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
        />
      ),
      Film: (step) => (
        <FilmStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
        />
      ),
      Transport: (step) => (
        <TransportStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
        />
      ),
      Review: (step) => (
        <ReviewStep step={step} onCtaClick={onCtaClick} />
      ),
      Failed: (step) => (
        <FailedStep step={step} onCtaClick={onCtaClick} />
      ),
    })}
  </AppShell>
);
