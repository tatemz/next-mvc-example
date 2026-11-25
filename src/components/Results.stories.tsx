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
} satisfies Meta<typeof Results>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadyStarWars: Story = {
  args: resultsReady(starWars, starWars.transport),
};

export const ReadyGhibli: Story = {
  args: resultsReady(ghibliPilot, ghibliPilot.transport),
};

export const ReadyStarWarsWithoutTransport: Story = {
  args: resultsReady(starWars, null),
};

export const ReadyGhibliWithoutTransport: Story = {
  args: resultsReady(ghibli, null),
};

export const MissingStarWars: Story = {
  args: resultsMissing(starWars),
};

export const MissingGhibli: Story = {
  args: resultsMissing(ghibli),
};
