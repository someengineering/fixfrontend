import { Divider, useMediaQuery } from '@mui/material'

export const ProductTierDivider = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  return (
    <Divider
      key={isMobile.toString()}
      orientation={isMobile ? 'horizontal' : 'vertical'}
      sx={isMobile ? { width: '100%', my: 4, maxWidth: 336 } : undefined}
    />
  )
}
