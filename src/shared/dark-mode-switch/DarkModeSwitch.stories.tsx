import type { Meta, StoryObj } from '@storybook/react'

import { DarkModeSwitch } from './DarkModeSwitch'

const meta = {
  title: 'shared/dark-mode-switch',
  component: DarkModeSwitch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    whiteMode: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DarkModeSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const WithWhiteMode: Story = {
  args: {
    whiteMode: true,
  },
}

export const WithoutWhiteMode: Story = {
  args: {
    whiteMode: false,
  },
}
