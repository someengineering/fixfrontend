import type { Meta, StoryObj } from '@storybook/react'

import { ErrorBoundaryFallback } from './ErrorBoundaryFallback'

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
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    error: new Error('An error happened'),
  },
}
