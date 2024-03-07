import type { Meta, StoryObj } from '@storybook/react'

import { Trans } from '@lingui/macro'
import { LanguageButton } from './LanguageButton'

const meta = {
  title: 'shared/language-button',
  component: LanguageButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    whiteMode: { control: 'boolean' },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Trans>Accounts</Trans>
      </>
    ),
  ],
} satisfies Meta<typeof LanguageButton>

export default meta
type Story = StoryObj<typeof meta>

export const WithWhiteMode: Story = {
  args: {
    whiteMode: true,
  },
}

export const WithoutWhiteMode: Story = {
  args: {},
}
