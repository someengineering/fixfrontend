import { colorFromRedToGreen } from 'src/shared/constants'

export const colorsBySeverity = {
  Critical: colorFromRedToGreen[0],
  High: colorFromRedToGreen[40],
  Medium: colorFromRedToGreen[60],
  Low: colorFromRedToGreen[80],
  Passed: colorFromRedToGreen[100],
}
