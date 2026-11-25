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
} from "../../.storybook/pageFixtures";
import { FunnelView } from "./FunnelView";

const meta = {
  title: "Pages/GhibliFunnel",
  component: FunnelView,
  args: {
    dispatch: () => {},
    isPending: false,
    onCtaClick: () => {},
    onQueryBlur: () => {},
  },
} satisfies Meta<typeof FunnelView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  args: { model: funnelSearch(ghibli) },
};

export const SearchWithError: Story = {
  args: { model: funnelSearchWithError(ghibli) },
};

export const SearchPending: Story = {
  args: { model: funnelSearch(ghibli), isPending: true },
};

export const Choose: Story = {
  args: { model: funnelChoose(ghibli, "Pazu") },
};

export const ChoosePending: Story = {
  args: { model: funnelChoose(ghibli, "Pazu"), isPending: true },
};

export const Film: Story = {
  args: { model: funnelFilm(ghibli) },
};

export const FilmPending: Story = {
  args: { model: funnelFilm(ghibli), isPending: true },
};

export const Transport: Story = {
  args: { model: funnelTransport(ghibliPilot) },
};

export const TransportPending: Story = {
  args: { model: funnelTransport(ghibliPilot), isPending: true },
};

export const Review: Story = {
  args: { model: funnelReview(ghibliPilot, ghibliPilot.transport) },
};

export const ReviewWithSpecies: Story = {
  args: { model: funnelReview(ghibli, ghibli.transport) },
};

export const ReviewNoTransport: Story = {
  args: { model: funnelReview(ghibli, null) },
};

export const Failed: Story = {
  args: { model: funnelFailed(ghibli) },
};

export const FailedInvalidChoice: Story = {
  args: { model: funnelFailedInvalidChoice(ghibli) },
};
