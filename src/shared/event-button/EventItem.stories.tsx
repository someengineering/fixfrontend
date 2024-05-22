import type { Meta, StoryObj } from '@storybook/react'

import { EventItem } from './EventItem'

const meta = {
  title: 'shared/event-button/EventItem',
  component: EventItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      at: { control: 'date' },
      id: { control: 'text' },
      kind: {
        options: [
          'cloud_account_discovered',
          'aws_account_discovered',
          'cloud_account_configured',
          'aws_account_configured',
          'cloud_account_deleted',
          'aws_account_deleted',
          'cloud_account_degraded',
          'aws_account_degraded',
        ],
      },
      publisher: { control: 'text' },
      data: {
        aws_account_id: { control: 'text' },
        cloud_account_id: { control: 'text' },
        workspace_id: { control: 'text' },
      },
    },
  },
} satisfies Meta<typeof EventItem>

export default meta
type Story = StoryObj<typeof meta>

export const CollectProgress: Story = {
  args: {
    data: [
      {
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
    ],
  },
  argTypes: {
    data: {
      at: { control: 'date' },
      id: { control: 'text' },
      kind: { options: ['collect-progress'] },
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
}
