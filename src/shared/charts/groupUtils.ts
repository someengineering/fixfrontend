import { alpha, colors } from '@mui/material'
// eslint-disable-next-line no-restricted-imports
import { blend } from '@mui/system'

type MaterialColorsType = typeof colors
type MaterialColorKeysType = Exclude<keyof MaterialColorsType, 'common'>
type MaterialColorKeys = keyof MaterialColorsType[MaterialColorKeysType]

const groupToColorMaterial = (number: MaterialColorKeys, group?: string) => {
  switch (group) {
    case 'networking':
      return colors.purple[number]
    case 'misc':
      return colors.green[number]
    case 'storage':
      return colors.yellow[number]
    case 'access_control':
      return colors.pink[number]
    case 'control':
      return colors.blue[number]
    case 'compute':
      return colors.orange[number]
    case 'database':
      return colors.cyan[number]
    default:
      return null
  }
}

export const groupToColor = (defaultColor: string, group?: string, disabled?: boolean) => {
  const color = groupToColorMaterial(group === 'storage' ? 800 : 600, group) ?? defaultColor
  return disabled ? alpha(blend(color, colors.grey[600], 0.8), 0.7) : color
}
