import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  funnelChoose,
  funnelFailed,
  funnelFailedInvalidChoice,
  funnelFilm,
  funnelReview,
  funnelSearch,
  funnelSearchWithError,
  funnelTransport,
  ghibli,
  ghibliPilot,
  starWars,
  starWarsHuman,
} from "../../.storybook/pageFixtures";
import { Funnel } from "./Funnel";

const meta = {
  title: "Pages/Funnel",
  component: Funnel,
  args: {
    dispatch: () => {},
    isPending: false,
  },
} satisfies Meta<typeof Funnel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchStarWars: Story = {
  args: funnelSearch(starWars),
};

export const SearchGhibli: Story = {
  args: funnelSearch(ghibli),
};

export const SearchStarWarsWithError: Story = {
  args: funnelSearchWithError(starWars),
};

export const SearchGhibliWithError: Story = {
  args: funnelSearchWithError(ghibli),
};

export const SearchStarWarsPending: Story = {
  args: { ...funnelSearch(starWars), isPending: true },
};

export const SearchGhibliPending: Story = {
  args: { ...funnelSearch(ghibli), isPending: true },
};

export const ChooseStarWars: Story = {
  args: funnelChoose(starWars, "Leia Organa"),
};

export const ChooseGhibli: Story = {
  args: funnelChoose(ghibli, "Pazu"),
};

export const ChooseStarWarsPending: Story = {
  args: {
    ...funnelChoose(starWars, "Leia Organa"),
    isPending: true,
  },
};

export const ChooseGhibliPending: Story = {
  args: { ...funnelChoose(ghibli, "Pazu"), isPending: true },
};

export const FilmStarWars: Story = {
  args: funnelFilm(starWars),
};

export const FilmGhibli: Story = {
  args: funnelFilm(ghibli),
};

export const FilmStarWarsPending: Story = {
  args: { ...funnelFilm(starWars), isPending: true },
};

export const FilmGhibliPending: Story = {
  args: { ...funnelFilm(ghibli), isPending: true },
};

export const TransportStarWars: Story = {
  args: funnelTransport(starWars),
};

export const TransportGhibli: Story = {
  args: funnelTransport(ghibliPilot),
};

export const TransportStarWarsPending: Story = {
  args: { ...funnelTransport(starWars), isPending: true },
};

export const TransportGhibliPending: Story = {
  args: { ...funnelTransport(ghibliPilot), isPending: true },
};

export const ReviewStarWars: Story = {
  args: funnelReview(starWars, starWars.transport),
};

export const ReviewGhibli: Story = {
  args: funnelReview(ghibliPilot, ghibliPilot.transport),
};

export const ReviewStarWarsWithSpecies: Story = {
  args: funnelReview(starWarsHuman, starWarsHuman.transport),
};

export const ReviewGhibliWithSpecies: Story = {
  args: funnelReview(ghibli, ghibli.transport),
};

export const ReviewStarWarsNoTransport: Story = {
  args: funnelReview(starWars, null),
};

export const ReviewGhibliNoTransport: Story = {
  args: funnelReview(ghibli, null),
};

export const FailedStarWars: Story = {
  args: funnelFailed(starWars),
};

export const FailedGhibli: Story = {
  args: funnelFailed(ghibli),
};

export const FailedStarWarsInvalidChoice: Story = {
  args: funnelFailedInvalidChoice(starWars),
};

export const FailedGhibliInvalidChoice: Story = {
  args: funnelFailedInvalidChoice(ghibli),
};
