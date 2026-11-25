import { ResultsCtas, type ResultsCta } from "../ui-events/UiEvent";
import { PersonCard } from "./PersonCard";
import type { ResultsViewModel } from "./ResultsView";

type ResultsReadyViewModel = typeof ResultsViewModel.cases.Ready.Type;

export type ResultsReadyViewProps = {
  readonly model: ResultsReadyViewModel;
  readonly onCtaClick: (cta: ResultsCta) => void;
};

export const ResultsReadyView = ({
  model,
  onCtaClick,
}: ResultsReadyViewProps) => (
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
        onClick={() => onCtaClick(ResultsCtas.BuildAnotherDossier)}
        className="btn btn-primary"
      >
        {model.startOverLabel}
      </a>
      <a
        href={model.homeHref}
        onClick={() => onCtaClick(ResultsCtas.BackHome)}
        className="btn btn-ghost"
      >
        {model.homeLabel}
      </a>
    </div>
  </div>
);
