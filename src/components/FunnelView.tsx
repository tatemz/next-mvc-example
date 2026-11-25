import { Array, Option, Schema } from "effect";
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
import { FunnelChooseStep } from "./FunnelChooseStep";
import { FunnelFailedStep } from "./FunnelFailedStep";
import { FunnelFilmStep } from "./FunnelFilmStep";
import { FunnelReviewStep } from "./FunnelReviewStep";
import { FunnelSearchStep } from "./FunnelSearchStep";
import { FunnelTransportStep } from "./FunnelTransportStep";
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

export const makeFunnelSearchResult =
  (i18n: I18n, step: FunnelSearchViewModel) =>
  (input: FunnelSearchInput): FunnelViewModel =>
    Option.match(input.form, {
      onNone: () =>
        searchViewModel(
          i18n,
          step.shell,
          "",
          i18n._({ id: "funnel.search.required" }),
        ),
      onSome: (form) =>
        Option.match(input.results, {
          onNone: () =>
            makeFunnelFailedViewModel(
              i18n,
              step.shell,
              "unavailable",
            ),
          onSome: (results) =>
            Array.matchLeft(results, {
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
            }),
        }),
    });

export const makeFunnelChooseResult =
  (i18n: I18n, step: FunnelChooseViewModel) =>
  (input: FunnelChooseInput): FunnelViewModel =>
    Option.match(input.form, {
      onNone: () =>
        makeFunnelFailedViewModel(
          i18n,
          step.shell,
          "invalidChoice",
        ),
      onSome: (form) => {
        if (!isAvailableChoice(step, form.characterId)) {
          return makeFunnelFailedViewModel(
            i18n,
            step.shell,
            "invalidChoice",
          );
        }

        return Option.match(input.person, {
          onNone: () =>
            makeFunnelFailedViewModel(
              i18n,
              step.shell,
              "unavailable",
            ),
          onSome: (person) =>
            makeFunnelFilmViewModel(i18n, step.shell, person),
        });
      },
    });

export const makeFunnelFilmResult =
  (i18n: I18n, step: FunnelFilmViewModel) =>
  (input: FunnelFilmInput): FunnelViewModel =>
    Option.match(
      Option.flatMap(input.form, ({ order }) =>
        Array.findFirst(
          step.person.films,
          (candidate) => candidate.order === order,
        )
      ),
      {
        onNone: () =>
          makeFunnelFailedViewModel(
            i18n,
            step.shell,
            "invalidChoice",
          ),
        onSome: (film) =>
          makeFunnelTransportViewModel(
            i18n,
            step.shell,
            step.person,
            film,
          ),
      },
    );

export const makeFunnelTransportResult =
  (i18n: I18n, step: FunnelTransportViewModel) =>
  (input: FunnelTransportInput): FunnelViewModel =>
    Option.match(input.form, {
      onNone: () =>
        makeFunnelFailedViewModel(
          i18n,
          step.shell,
          "invalidChoice",
        ),
      onSome: ({ transportKey }) => {
        const transport = transportKey === "none"
          ? Option.none<TransportViewModel>()
          : Array.findFirst(
            step.person.transports,
            (candidate) => candidate.key === transportKey,
          );

        if (transportKey !== "none" && Option.isNone(transport)) {
          return makeFunnelFailedViewModel(
            i18n,
            step.shell,
            "invalidChoice",
          );
        }

        return makeFunnelReviewViewModel(
          i18n,
          step.shell,
          step.person,
          step.film,
          Option.getOrNull(transport),
        );
      },
    });

type FunnelExtras = {
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
  readonly onCtaClick: (cta: FunnelCta) => void;
  readonly onQueryChange: (value: string) => void;
};

export type FunnelViewProps = FunnelExtras & {
  readonly model: FunnelViewModel;
};

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
        <FunnelSearchStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
          onQueryChange={onQueryChange}
        />
      ),
      Choose: (step) => (
        <FunnelChooseStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
        />
      ),
      Film: (step) => (
        <FunnelFilmStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
        />
      ),
      Transport: (step) => (
        <FunnelTransportStep
          step={step}
          dispatch={dispatch}
          isPending={isPending}
          onCtaClick={onCtaClick}
        />
      ),
      Review: (step) => (
        <FunnelReviewStep step={step} onCtaClick={onCtaClick} />
      ),
      Failed: (step) => (
        <FunnelFailedStep step={step} onCtaClick={onCtaClick} />
      ),
    })}
  </AppShell>
);
