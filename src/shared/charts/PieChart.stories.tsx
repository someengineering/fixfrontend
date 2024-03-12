import type { Meta, StoryObj } from '@storybook/react'

import { colorFromRedToGreen } from 'src/shared/constants'
import { PieChart } from './PieChart'

const colorsBySeverity = {
  test1: colorFromRedToGreen[0],
  test2: colorFromRedToGreen[40],
  test3: colorFromRedToGreen[60],
  test4: colorFromRedToGreen[80],
  test5: colorFromRedToGreen[100],
}

const meta = {
  title: 'shared/charts/PieChart',
  component: PieChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof PieChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: [
      { name: 'test1', value: 50, description: 'This is test 1', label: 'Label1' },
      { name: 'test2', value: 25, description: 'This is test 2', label: 'Label2' },
      { name: 'test3', value: 12, description: 'This is test 3', label: 'Label3' },
      { name: 'test4', value: 6, description: 'This is test 4', label: 'Label4' },
      { name: 'test5', value: 20, description: 'This is test 5', label: 'Label5' },
    ],
    colors: colorsBySeverity,
    height: 400,
    width: 400,
    showLabel: true,
  },
}
