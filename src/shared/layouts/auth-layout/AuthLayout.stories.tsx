import type { Meta, StoryObj } from '@storybook/react'

import { AuthLayout } from './AuthLayout'

const meta = {
  title: 'shared/layouts/auth-layout/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Auth layout',
  },
  argTypes: {
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
