import type { Meta, StoryObj } from '@storybook/react'

import { EventCollectProgressItem } from './EventCollectProgressItem'

const meta = {
  title: 'shared/event-button/EventCollectProgressItem',
  component: EventCollectProgressItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    parts: [
      { current: 25, total: 50, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '1'] },
      { current: 24, total: 25, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '2'] },
      { current: 75, total: 75, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '3'] },
      { current: 5, total: 65, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '4'] },
      { current: 1, total: 2, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '5'] },
    ],
  },
} satisfies Meta<typeof EventCollectProgressItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
