import type { Meta, StoryObj } from '@storybook/react'

import { CloudAvatar } from './CloudAvatar'

const meta = {
  title: 'shared/cloud-avatar',
  component: CloudAvatar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    cloud: {
      options: ['fix', 'aws', 'gcp'],
      control: { type: 'select' },
    },
    error: {
      defaultValue: '',
      control: { type: 'text' },
    },
    tooltip: {
      defaultValue: '',
      control: { type: 'text' },
    },
    withCrown: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
    onErrorClick: {
      action: 'clicked!',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CloudAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Fix: Story = {
  args: {
    cloud: 'fix',
  },
}

export const GCP: Story = {
  args: {
    cloud: 'gcp',
  },
}

export const AWS: Story = {
  args: {
    cloud: 'aws',
  },
}

export const AWSWithCrows: Story = {
  args: {
    cloud: 'aws',
    withCrown: true,
  },
}

export const AWSWithError: Story = {
  args: {
    cloud: 'aws',
    error: 'There have been an error',
  },
}

export const AWSWithErrorAndCrows: Story = {
  args: {
    cloud: 'aws',
    withCrown: true,
    error: 'There have been an error',
  },
}

export const AWSWithTooltip: Story = {
  args: {
    cloud: 'aws',
    tooltip: "Here's a tooltip",
  },
}
