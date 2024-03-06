import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'
import { DurationPicker } from './DurationPicker'

const meta = {
  title: 'shared/duration-picker',
  component: DurationPicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      defaultValue: '',
      control: { type: 'text' },
    },
    onChange: {
      action: 'changed!',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DurationPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '',
  },
  render: function Render({ value, onChange }) {
    const [val, setVal] = useState(value)
    return (
      <DurationPicker
        value={val}
        onChange={(e) => {
          setVal(e)
          onChange(e)
        }}
      />
    )
  },
}
