import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ghibli,
  ghibliPilot,
  resultsMissing,
  resultsReady,
  starWars,
} from "../../.storybook/pageFixtures";
import { Results } from "./Results";

const meta = {
  title: "Pages/Results",
  component: Results,
  args: {
    onCtaClick: () => {},
  },
} satisfies Meta<typeof Results>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadyStarWars: Story = {
  args: { model: resultsReady(starWars, starWars.transport) },
};

export const ReadyGhibli: Story = {
  args: { model: resultsReady(ghibliPilot, ghibliPilot.transport) },
};

export const ReadyStarWarsWithoutTransport: Story = {
  args: { model: resultsReady(starWars, null) },
};

export const ReadyGhibliWithoutTransport: Story = {
  args: { model: resultsReady(ghibli, null) },
};

export const MissingStarWars: Story = {
  args: { model: resultsMissing(starWars) },
};

export const MissingGhibli: Story = {
  args: { model: resultsMissing(ghibli) },
};
