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
    data: {
      at: new Date(),
      id: '1',
      kind: 'collect-progress',
      publisher: 'publisher',
      data: {
        task: 'test-task',
        workflow: 'test-workflow',
        message: {
          kind: 'test-kind',
          name: 'test-name',
          parts: [
            { current: 25, total: 50, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '1'] },
            { current: 24, total: 25, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '2'] },
            { current: 75, total: 75, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '3'] },
            { current: 5, total: 65, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '4'] },
            { current: 1, total: 2, kind: 'another-test-kind', name: 'another-test-name', path: ['path', 'to', '5'] },
          ],
        },
      },
    },
  },
  argTypes: {
    data: {
      at: { control: 'date' },
      id: { control: 'text' },
      kind: 'collect-progress',
      publisher: { control: 'text' },
      data: {
        task: { control: 'text' },
        workflow: { control: 'text' },
        message: {
          kind: { control: 'text' },
          name: { control: 'text' },
        },
      },
    },
  },
} satisfies Meta<typeof EventCollectProgressItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
