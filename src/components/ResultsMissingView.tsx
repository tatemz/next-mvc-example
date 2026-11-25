import { ResultsCtas, type ResultsCta } from "../ui-events/UiEvent";
import type { ResultsViewModel } from "./ResultsView";

type ResultsMissingViewModel = typeof ResultsViewModel.cases.Missing.Type;

export type ResultsMissingViewProps = {
  readonly model: ResultsMissingViewModel;
  readonly onCtaClick: (cta: ResultsCta) => void;
};

export const ResultsMissingView = ({
  model,
  onCtaClick,
}: ResultsMissingViewProps) => (
  <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold">{model.heading}</h1>
    <div role="alert" className="alert alert-error">
      {model.message}
    </div>
    <a
      href={model.startOverHref}
      onClick={() => onCtaClick(ResultsCtas.BuildAnotherDossier)}
      className="btn btn-primary"
    >
      {model.startOverLabel}
    </a>
  </div>
);
