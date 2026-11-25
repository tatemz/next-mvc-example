import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ghibli,
  homeSplash,
  starWars,
} from "../../.storybook/pageFixtures";
import { HomePage } from "./HomePage";

const meta = {
  title: "Pages/HomePage",
  component: HomePage,
  args: {
    onCtaClick: () => {},
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SplashStarWars: Story = {
  args: homeSplash(starWars),
};

export const SplashGhibli: Story = {
  args: homeSplash(ghibli),
};
