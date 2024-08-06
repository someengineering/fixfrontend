import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Button, ButtonProps, ButtonTypeMap } from '@mui/material'
import { ElementType } from 'react'

type ExternalLinkButtonProps<RootComponent extends ElementType, AdditionalProps> = ButtonProps<RootComponent, AdditionalProps> & {
  href: string
}

export function ExternalLinkButton<RootComponent extends ElementType = ButtonTypeMap['defaultComponent'], AdditionalProps = unknown>({
  href,
  children,
  ...props
}: ExternalLinkButtonProps<RootComponent, AdditionalProps>) {
  return (
    <Button href={href} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon fontSize="small" />} {...props}>
      {children || href}
    </Button>
  )
}
