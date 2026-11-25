import { FunnelCtas } from "../ui-events/UiEvent";
import { FunnelStepProps, FunnelStepShell } from "./FunnelStep";
import type { FunnelViewModel } from "./FunnelView";

type TransportStepProps = FunnelStepProps<
  typeof FunnelViewModel.cases.Transport.Type,
  typeof FunnelCtas.ReviewDossier
>;

export const FunnelTransportStep = ({
  step,
  dispatch,
  isPending,
  onCtaClick,
}: TransportStepProps) => (
  <FunnelStepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick(FunnelCtas.ReviewDossier)}
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
  </FunnelStepShell>
);
