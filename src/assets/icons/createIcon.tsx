import { Palette, useTheme } from '@mui/material'
import { FC, SVGProps, forwardRef } from 'react'

export type SvgIconProps = SVGProps<SVGSVGElement> & { title?: string; nonce?: string }

export const createIcon = (Icon: FC<SvgIconProps>, colors?: [string, string?]) => {
  const whiteColor = colors?.[0]
  const darkColor = colors?.[1]
  const SvgIconComp: FC<SvgIconProps> = forwardRef(({ color, fill, ...props }, ref) => {
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
    return <Icon key={iconColor} {...props} ref={ref} fill={iconColor} />
  })
  SvgIconComp.displayName = Icon.displayName || Icon.name
  return SvgIconComp
}
