import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  resultsMissing,
  resultsReady,
  starWars,
} from "../../.storybook/pageFixtures";
import { ResultsView } from "./ResultsView";

const meta = {
  title: "Pages/StarWarsResults",
  component: ResultsView,
  args: {
    onCtaClick: () => {},
  },
} satisfies Meta<typeof ResultsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  args: { model: resultsReady(starWars, starWars.transport) },
};

export const ReadyWithoutTransport: Story = {
  args: { model: resultsReady(starWars, null) },
};

export const Missing: Story = {
  args: { model: resultsMissing(starWars) },
};
