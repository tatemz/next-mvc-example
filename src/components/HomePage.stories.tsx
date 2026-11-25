import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ghibli,
  ghibliPilot,
  homeFailed,
  homeLoaded,
  homeLoadedWithError,
  starWars,
  starWarsHuman,
} from "../../.storybook/pageFixtures";
import { HomePage } from "./HomePage";

const meta = {
  title: "Pages/HomePage",
  component: HomePage,
  args: {
    dispatch: () => {},
    isPending: false,
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadedStarWars: Story = {
  args: homeLoaded(starWars),
};

export const LoadedGhibli: Story = {
  args: homeLoaded(ghibli),
};

export const LoadedStarWarsWithValidationError: Story = {
  args: homeLoadedWithError(starWars),
};

export const LoadedGhibliWithValidationError: Story = {
  args: homeLoadedWithError(ghibli),
};

export const LoadedStarWarsPending: Story = {
  args: { ...homeLoaded(starWars), isPending: true },
};

export const LoadedGhibliPending: Story = {
  args: { ...homeLoaded(ghibli), isPending: true },
};

export const LoadedStarWarsWithSpecies: Story = {
  args: homeLoaded(starWarsHuman),
};

export const LoadedGhibliWithSpecies: Story = {
  args: homeLoaded(ghibliPilot),
};

export const FailedStarWars: Story = {
  args: homeFailed(starWars, "abc"),
};

export const FailedGhibli: Story = {
  args: homeFailed(ghibli, "999"),
};

export const FailedStarWarsPending: Story = {
  args: { ...homeFailed(starWars, "abc"), isPending: true },
};

export const FailedGhibliPending: Story = {
  args: { ...homeFailed(ghibli, "999"), isPending: true },
};
