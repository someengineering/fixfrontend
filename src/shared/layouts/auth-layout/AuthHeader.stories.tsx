import type { Meta, StoryObj } from '@storybook/react'

import { AuthHeader } from './AuthHeader'

const meta = {
  title: 'shared/layouts/auth-layout/AuthHeader',
  component: AuthHeader,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Auth header',
  },
  argTypes: {
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
