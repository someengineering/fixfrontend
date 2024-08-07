import type { Meta, StoryObj } from '@storybook/react'

import { ErrorBoundaryFallback } from './index'

const meta = {
  title: 'shared/error-boundary-fallback/ErrorBoundaryFallback',
  component: ErrorBoundaryFallback,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    resetErrorBoundary: { action: 'clicked!' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBoundaryFallback>

export default meta
type Story = StoryObj<typeof ErrorBoundaryFallback>

export const Default: Story = {
  args: {
    error: new Error('An error happened'),
  },
}
