import { Link, LinkProps, LinkTypeMap } from '@mui/material'
import { ElementType } from 'react'
import { NavigateOptions } from 'react-router-dom'

type ExternalLinkProps<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown> = LinkProps<
  RootComponent,
  AdditionalProps
> & {
  href: string
  options?: NavigateOptions
}

export function ExternalLink<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown>({
  href,
  options,
  ...props
}: ExternalLinkProps<RootComponent, AdditionalProps>) {
  return (
    <Link target="_blank" rel="noopener noreferrer" href={href} {...props}>
      {props.children || href}
    </Link>
  )
}
