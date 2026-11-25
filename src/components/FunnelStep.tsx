import type { ReactNode } from "react";
import type { FunnelCta } from "../ui-events/UiEvent";

type StepShellProps = {
  readonly step: {
    readonly stepLabel: string;
    readonly heading: string;
    readonly subtitle: string;
  };
  readonly children: ReactNode;
};

export const FunnelStepShell = ({ step, children }: StepShellProps) => (
  <section className="card bg-base-100 shadow-xl">
    <div className="card-body gap-4">
      <span className="badge badge-secondary">{step.stepLabel}</span>
      <h1 className="card-title text-3xl">{step.heading}</h1>
      <p className="text-base-content/70">{step.subtitle}</p>
      {children}
    </div>
  </section>
);

export type FunnelStepProps<T, Cta extends FunnelCta = FunnelCta> = {
  readonly step: T;
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
  readonly onCtaClick: (cta: Cta) => void;
};
