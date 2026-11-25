import { Option } from "effect";
import { FunnelCtas } from "../ui-events/UiEvent";
import { FunnelStepShell } from "./FunnelStep";
import type { FunnelViewModel } from "./FunnelView";

type ReviewStepProps = {
  readonly step: typeof FunnelViewModel.cases.Review.Type;
  readonly onCtaClick: (
    cta: typeof FunnelCtas.OpenDossier | typeof FunnelCtas.StartOver,
  ) => void;
};

export const FunnelReviewStep = ({ step, onCtaClick }: ReviewStepProps) => (
  <FunnelStepShell step={step}>
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
        onClick={() => onCtaClick(FunnelCtas.OpenDossier)}
        className="btn btn-primary"
      >
        {step.openLabel}
      </a>
      <a
        href={step.startOverHref}
        onClick={() => onCtaClick(FunnelCtas.StartOver)}
        className="btn btn-ghost"
      >
        {step.startOverLabel}
      </a>
    </div>
  </FunnelStepShell>
);
