import { Palette, useTheme } from '@mui/material'
import { FC, FunctionComponent, SVGProps, forwardRef } from 'react'
import { useNonce } from 'src/shared/providers'

type SvgIconProps = SVGProps<SVGSVGElement> & { title?: string; nonce?: string }

export const createIcon = (Icon: FunctionComponent<SvgIconProps>) => {
  const SvgIconComp: FC<SvgIconProps> = forwardRef(({ color, fill, ...props }, ref) => {
    const { palette } = useTheme()
    const nonce = useNonce()
    type KeyOfPalette = 'common'
    type PaletteAsObject = Palette[KeyOfPalette]
    type KeyOfPaletteAsObject = keyof PaletteAsObject
    let iconColor = fill || color || palette.primary.main
    const [firstColorKey, secondColorKey] = (color?.split('.') ?? []) as KeyOfPalette[]
    if (
      !fill &&
      firstColorKey &&
      firstColorKey in palette &&
      (typeof palette[firstColorKey] === 'string' ||
        (typeof palette[firstColorKey] === 'object' && secondColorKey && secondColorKey in palette[firstColorKey]))
    ) {
      iconColor = palette[firstColorKey][secondColorKey as KeyOfPaletteAsObject]
    }
    return <Icon nonce={nonce} {...props} ref={ref} fill={iconColor} />
  })
  SvgIconComp.displayName = Icon.displayName || Icon.name
  return SvgIconComp
}
