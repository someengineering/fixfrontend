import { Palette, useTheme } from '@mui/material'
import { FC, FunctionComponent, SVGProps } from 'react'

type SvgIconProps = SVGProps<SVGSVGElement> & { title?: string | undefined }

export const createIcon = (Icon: FunctionComponent<SvgIconProps>, colors?: [string, string?]) => {
  const whiteColor = colors?.[0]
  const darkColor = colors?.[1]
  const SvgIconComp: FC<SvgIconProps> = ({ color, fill, ...props }) => {
    const { palette } = useTheme()
    type KeyOfPalette = 'common'
    type PaletteAsObject = Palette[KeyOfPalette]
    type KeyOfPaletteAsObject = keyof PaletteAsObject
    let iconColor =
      fill || color || (colors ? (palette.mode === 'dark' ? darkColor || whiteColor : whiteColor) : undefined) || palette.common.black
    const [firstColorKey, secondColorKey] = (iconColor?.split('.') ?? []) as KeyOfPalette[]
    if (
      !fill &&
      firstColorKey &&
      firstColorKey in palette &&
      (typeof palette[firstColorKey] === 'string' ||
        (typeof palette[firstColorKey] === 'object' && secondColorKey && secondColorKey in palette[firstColorKey]))
    ) {
      iconColor = palette[firstColorKey][secondColorKey as KeyOfPaletteAsObject]
    }
    return <Icon key={iconColor} {...props} fill={iconColor} />
  }
  SvgIconComp.displayName = Icon.displayName || Icon.name
  return SvgIconComp
}
