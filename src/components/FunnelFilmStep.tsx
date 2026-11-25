import { FunnelFields } from "../forms/FunnelForm";
import { FunnelCtas } from "../ui-events/UiEvent";
import { FunnelStepProps, FunnelStepShell } from "./FunnelStep";
import type { FunnelViewModel } from "./FunnelView";

type FilmStepProps = FunnelStepProps<
  typeof FunnelViewModel.cases.Film.Type,
  typeof FunnelCtas.NextTransport
>;

export const FunnelFilmStep = ({
  step,
  dispatch,
  isPending,
  onCtaClick,
}: FilmStepProps) => (
  <FunnelStepShell step={step}>
    <form
      action={dispatch}
      onSubmit={() => onCtaClick(FunnelCtas.NextTransport)}
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
              name={FunnelFields.Order}
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
  </FunnelStepShell>
);
