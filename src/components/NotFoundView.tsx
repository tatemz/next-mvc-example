import { Schema } from "effect";
import type { I18n } from "../i18n/I18n.service";

export const NotFoundViewModel = Schema.TaggedStruct("NotFoundViewModel", {
  heading: Schema.NonEmptyString,
  message: Schema.NonEmptyString,
  homeLabel: Schema.NonEmptyString,
  homeHref: Schema.NonEmptyString,
});
export type NotFoundViewModel = typeof NotFoundViewModel.Type;

export const makeNotFoundViewModel = (i18n: I18n): NotFoundViewModel =>
  NotFoundViewModel.make({
    heading: i18n._({ id: "notFound.heading" }),
    message: i18n._({ id: "notFound.message" }),
    homeLabel: i18n._({ id: "notFound.home" }),
    homeHref: "/",
  });

export type NotFoundViewProps = {
  readonly model: NotFoundViewModel;
};

export const NotFoundView = ({ model }: NotFoundViewProps) => (
  <main className="hero min-h-screen bg-base-200">
    <div className="hero-content text-center">
      <div>
        <h1 className="text-4xl font-bold">{model.heading}</h1>
        <p className="py-4 text-base-content/70">{model.message}</p>
        <a href={model.homeHref} className="btn btn-primary">
          {model.homeLabel}
        </a>
      </div>
    </div>
  </main>
);
