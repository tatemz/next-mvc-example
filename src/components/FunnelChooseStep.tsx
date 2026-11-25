import { FunnelCtas } from "../ui-events/UiEvent";
import { FunnelStepProps, FunnelStepShell } from "./FunnelStep";
import type { FunnelViewModel } from "./FunnelView";

type ChooseStepProps = FunnelStepProps<
  typeof FunnelViewModel.cases.Choose.Type,
  typeof FunnelCtas.ChooseCharacter
>;

export const FunnelChooseStep = ({
  step,
  dispatch,
  isPending,
  onCtaClick,
}: ChooseStepProps) => (
  <FunnelStepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick(FunnelCtas.ChooseCharacter)}
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
  </FunnelStepShell>
);
