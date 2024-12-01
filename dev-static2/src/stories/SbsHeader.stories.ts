import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { SbsHeader } from './SbsHeader';

const meta = {
  title: 'SbsHeader',
  component: SbsHeader,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
  },
} satisfies Meta<typeof SbsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Stu 123',
    },
  },
};

export const LoggedOut: Story = {};
