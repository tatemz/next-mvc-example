import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ghibli,
  ghibliPilot,
  resultsMissing,
  resultsReady,
} from "../../.storybook/pageFixtures";
import { ResultsView } from "./ResultsView";

const meta = {
  title: "Pages/GhibliResults",
  component: ResultsView,
  args: {
    onCtaClick: () => {},
  },
} satisfies Meta<typeof ResultsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  args: { model: resultsReady(ghibliPilot) },
};

export const ReadyWithoutTransport: Story = {
  args: { model: resultsReady(ghibli, null) },
};

export const Missing: Story = {
  args: { model: resultsMissing(ghibli) },
};
