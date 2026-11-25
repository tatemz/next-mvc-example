import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  homeFailed,
  homeFailedGhibli,
  homeLoaded,
  homeLoadedGhibli,
  homeLoadedWithError,
  homeLoadedWithSpecies,
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

export const Loaded: Story = {
  args: homeLoaded,
};

export const LoadedWithValidationError: Story = {
  args: homeLoadedWithError,
};

export const LoadedPending: Story = {
  args: { ...homeLoaded, isPending: true },
};

export const LoadedWithSpecies: Story = {
  args: homeLoadedWithSpecies,
};

export const LoadedGhibli: Story = {
  args: homeLoadedGhibli,
};

export const Failed: Story = {
  args: homeFailed,
};

export const FailedPending: Story = {
  args: { ...homeFailed, isPending: true },
};

export const FailedGhibli: Story = {
  args: homeFailedGhibli,
};
