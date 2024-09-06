import { CSSProperties } from 'react'

type ExtraVariants = 'bodyBiggest' | 'bodyBigger' | 'bodyBig' | 'buttonSmall' | 'buttonLarge' | 'linkBold' | 'subMenu'

type TypographyExtraVariants = Record<ExtraVariants, CSSProperties>

declare module '@mui/material/styles' {
  interface TypographyVariants extends TypographyVariants, TypographyExtraVariants {}
  interface TypographyVariantsOptions extends TypographyVariantsOptions, Partial<TypographyExtraVariants> {}
  interface Duration {
    slideShow: number
    longest: number
    longer: number
    long: number
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides extends TypographyPropsVariantOverrides, Record<ExtraVariants, true> {}
}

// convert it into a module by adding an empty export statement.
export {}
