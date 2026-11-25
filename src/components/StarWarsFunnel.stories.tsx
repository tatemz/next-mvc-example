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
  starWars,
  starWarsHuman,
} from "../../.storybook/pageFixtures";
import { FunnelView } from "./FunnelView";

const meta = {
  title: "Pages/StarWarsFunnel",
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
  args: { model: funnelSearch(starWars) },
};

export const SearchWithError: Story = {
  args: { model: funnelSearchWithError(starWars) },
};

export const SearchPending: Story = {
  args: { model: funnelSearch(starWars), isPending: true },
};

export const Choose: Story = {
  args: { model: funnelChoose(starWars, "Leia Organa") },
};

export const ChoosePending: Story = {
  args: {
    model: funnelChoose(starWars, "Leia Organa"),
    isPending: true,
  },
};

export const Film: Story = {
  args: { model: funnelFilm(starWars) },
};

export const FilmPending: Story = {
  args: { model: funnelFilm(starWars), isPending: true },
};

export const Transport: Story = {
  args: { model: funnelTransport(starWars) },
};

export const TransportPending: Story = {
  args: { model: funnelTransport(starWars), isPending: true },
};

export const Review: Story = {
  args: { model: funnelReview(starWars, starWars.transport) },
};

export const ReviewWithSpecies: Story = {
  args: { model: funnelReview(starWarsHuman, starWarsHuman.transport) },
};

export const ReviewNoTransport: Story = {
  args: { model: funnelReview(starWars, null) },
};

export const Failed: Story = {
  args: { model: funnelFailed(starWars) },
};

export const FailedInvalidChoice: Story = {
  args: { model: funnelFailedInvalidChoice(starWars) },
};
