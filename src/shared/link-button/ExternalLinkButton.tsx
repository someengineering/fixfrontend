import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Button, ButtonProps, ButtonTypeMap } from '@mui/material'
import { ElementType } from 'react'

type ExternalLinkButtonProps<RootComponent extends ElementType, AdditionalProps> = ButtonProps<RootComponent, AdditionalProps> & {
  href: string
  noEndIcon?: boolean
}

export function ExternalLinkButton<RootComponent extends ElementType = ButtonTypeMap['defaultComponent'], AdditionalProps = unknown>({
  href,
  component = Button,
  children,
  noEndIcon,
  ...props
}: ExternalLinkButtonProps<RootComponent, AdditionalProps>) {
  const Comp = component
  if (!noEndIcon && !props.endIcon) {
    props.endIcon = (<OpenInNewIcon fontSize="small" />) as ExternalLinkButtonProps<RootComponent, AdditionalProps>['endIcon']
  }
  return (
    <Comp href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children || href}
    </Comp>
  )
}
