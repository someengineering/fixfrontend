import { Link, LinkProps, LinkTypeMap } from '@mui/material'
import { ElementType } from 'react'

type ExternalLinkProps<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown> = LinkProps<
  RootComponent,
  AdditionalProps
> & {
  href: string
}

export function ExternalLink<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown>({
  href,
  ...props
}: ExternalLinkProps<RootComponent, AdditionalProps>) {
  return (
    <Link target="_blank" rel="noopener noreferrer" href={href} {...props}>
      {props.children || href}
    </Link>
  )
}
