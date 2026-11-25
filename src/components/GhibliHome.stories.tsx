import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ghibli, homeSplash } from "../../.storybook/pageFixtures";
import { HomeView } from "./HomeView";

const meta = {
  title: "Pages/GhibliHome",
  component: HomeView,
  args: {
    onCtaClick: () => {},
  },
} satisfies Meta<typeof HomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Splash: Story = {
  args: { model: homeSplash(ghibli) },
};
