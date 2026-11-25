import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  resultsMissing,
  resultsMissingGhibli,
  resultsReady,
  resultsReadyGhibli,
  resultsReadyNoTransport,
} from "../../.storybook/pageFixtures";
import { Results } from "./Results";

const meta = {
  title: "Pages/Results",
  component: Results,
} satisfies Meta<typeof Results>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  args: resultsReady,
};

export const ReadyWithoutTransport: Story = {
  args: resultsReadyNoTransport,
};

export const ReadyGhibli: Story = {
  args: resultsReadyGhibli,
};

export const Missing: Story = {
  args: resultsMissing,
};

export const MissingGhibli: Story = {
  args: resultsMissingGhibli,
};
