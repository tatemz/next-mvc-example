import { FunnelFields } from "../forms/FunnelForm";
import { FunnelCtas } from "../ui-events/UiEvent";
import { FunnelStepProps, FunnelStepShell } from "./FunnelStep";
import type { FunnelViewModel } from "./FunnelView";

type SearchStepProps = FunnelStepProps<
  typeof FunnelViewModel.cases.Search.Type,
  typeof FunnelCtas.Search
> & {
  readonly onQueryBlur: (value: string) => void;
};

export const FunnelSearchStep = ({
  step,
  dispatch,
  isPending,
  onCtaClick,
  onQueryBlur,
}: SearchStepProps) => (
  <FunnelStepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick(FunnelCtas.Search)}
      className="flex flex-col gap-3"
    >
      <label htmlFor="funnel-query" className="label-text">
        {step.label}
      </label>
      <input
        id="funnel-query"
        name={FunnelFields.Query}
        defaultValue={step.query}
        onBlur={(event) => onQueryBlur(event.currentTarget.value)}
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
  </FunnelStepShell>
);
