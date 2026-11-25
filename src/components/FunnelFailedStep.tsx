import { FunnelCtas } from "../ui-events/UiEvent";
import { FunnelStepShell } from "./FunnelStep";
import type { FunnelViewModel } from "./FunnelView";

type FailedStepProps = {
  readonly step: typeof FunnelViewModel.cases.Failed.Type;
  readonly onCtaClick: (cta: typeof FunnelCtas.StartOver) => void;
};

export const FunnelFailedStep = ({ step, onCtaClick }: FailedStepProps) => (
  <FunnelStepShell step={step}>
    <div role="alert" className="alert alert-error">
      {step.message}
    </div>
    <a
      href={step.startOverHref}
      onClick={() => onCtaClick(FunnelCtas.StartOver)}
      className="btn btn-primary"
    >
      {step.startOverLabel}
    </a>
  </FunnelStepShell>
);
