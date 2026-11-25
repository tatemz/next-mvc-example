import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  funnelChoose,
  funnelFailed,
  funnelFailedInvalidChoice,
  funnelFilm,
  funnelFilmGhibli,
  funnelReview,
  funnelReviewNoTransport,
  funnelReviewWithSpecies,
  funnelSearch,
  funnelSearchWithError,
  funnelTransport,
  funnelTransportGhibli,
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

export const Search: Story = {
  args: funnelSearch,
};

export const SearchWithError: Story = {
  args: funnelSearchWithError,
};

export const SearchPending: Story = {
  args: { ...funnelSearch, isPending: true },
};

export const Choose: Story = {
  args: funnelChoose,
};

export const ChoosePending: Story = {
  args: { ...funnelChoose, isPending: true },
};

export const Film: Story = {
  args: funnelFilm,
};

export const FilmGhibli: Story = {
  args: funnelFilmGhibli,
};

export const FilmPending: Story = {
  args: { ...funnelFilm, isPending: true },
};

export const Transport: Story = {
  args: funnelTransport,
};

export const TransportGhibli: Story = {
  args: funnelTransportGhibli,
};

export const TransportPending: Story = {
  args: { ...funnelTransport, isPending: true },
};

export const Review: Story = {
  args: funnelReview,
};

export const ReviewWithSpecies: Story = {
  args: funnelReviewWithSpecies,
};

export const ReviewNoTransport: Story = {
  args: funnelReviewNoTransport,
};

export const Failed: Story = {
  args: funnelFailed,
};

export const FailedInvalidChoice: Story = {
  args: funnelFailedInvalidChoice,
};
