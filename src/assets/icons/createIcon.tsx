import { Palette, useTheme } from '@mui/material'
import { FC, SVGProps, forwardRef } from 'react'

type SVGPropsType = SVGProps<SVGSVGElement>

export type SvgIconProps = SVGPropsType & { title?: string; nonce?: string }

export const createIcon = (Icon: FC<SvgIconProps>, colors?: [string, string?]) => {
  const whiteColor = colors?.[0]
  const darkColor = colors?.[1]
  const SvgIconComp: FC<SvgIconProps> = forwardRef(({ color, fontSize, width, height, fill, ...props }, ref) => {
    const { palette } = useTheme()
    type KeyOfPalette = 'common'
    type PaletteAsObject = Palette[KeyOfPalette]
    type KeyOfPaletteAsObject = keyof PaletteAsObject
    let iconColor = fill || color || (colors ? (palette.mode === 'dark' ? darkColor || whiteColor : whiteColor) : undefined) || 'inherit'
    const [firstColorKey, secondColorKey] = (iconColor?.split('.') ?? []) as KeyOfPalette[]
    if (!fill && firstColorKey && firstColorKey in palette) {
      if (typeof palette[firstColorKey] === 'string') {
        iconColor = palette[firstColorKey]
      } else if (
        typeof palette[firstColorKey] === 'object' &&
        ((secondColorKey && secondColorKey in palette[firstColorKey]) || 'main' in palette[firstColorKey])
      ) {
        iconColor = palette[firstColorKey][(secondColorKey ?? 'main') as KeyOfPaletteAsObject]
      }
    }
    let calcFontSize: number | undefined = 24
    switch (fontSize) {
      case 'small':
        calcFontSize = 20
        break
      case 'medium':
        calcFontSize = 24
        break
      case 'large':
        calcFontSize = 28
        break
    }
    const otherProps = { ...props, fill: 'currentColor' } as SvgIconProps
    if ((!height && !width) || (height && width)) {
      otherProps.width = width || '1em'
      otherProps.height = height || '1em'
    } else {
      if (width) {
        otherProps.width = width
      }
      if (height) {
        otherProps.height = height
      }
    }
    if (fontSize || calcFontSize) {
      otherProps.fontSize = fontSize || calcFontSize
    }
    if (iconColor) {
      otherProps.color = iconColor
    }
    return <Icon ref={ref} key={iconColor} {...otherProps} />
  })
  SvgIconComp.displayName = Icon.displayName || Icon.name
  return SvgIconComp
}
