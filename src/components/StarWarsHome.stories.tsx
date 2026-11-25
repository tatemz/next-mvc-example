import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeSplash, starWars } from "../../.storybook/pageFixtures";
import { HomeView } from "./HomeView";

const meta = {
  title: "Pages/StarWarsHome",
  component: HomeView,
  args: {
    onCtaClick: () => {},
  },
} satisfies Meta<typeof HomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Splash: Story = {
  args: { model: homeSplash(starWars) },
};
