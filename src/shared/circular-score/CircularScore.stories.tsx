import type { Meta, StoryObj } from '@storybook/react'

import { CircularScore } from './CircularScore'

const meta = {
  title: 'shared/circular-score',
  component: CircularScore,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    score: {
      defaultValue: 100,
      type: 'number',
    },
    syntheticScore: {
      defaultValue: 100,
      type: 'number',
    },
  },
} satisfies Meta<typeof CircularScore>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    score: 100,
  },
}
