import { Link, LinkProps, LinkTypeMap } from '@mui/material'
import { ElementType, MouseEvent as ReactMouseEvent } from 'react'
import { NavigateOptions, To } from 'react-router-dom'
import { getHrefFromTo, useAbsoluteNavigate } from 'src/shared/absolute-navigate'

type InternalLinkProps<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown> = LinkProps<
  RootComponent,
  AdditionalProps
> & {
  to: To
  options?: NavigateOptions
}

export function InternalLink<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown>({
  to,
  options,
  ...props
}: InternalLinkProps<RootComponent, AdditionalProps>) {
  const navigate = useAbsoluteNavigate()
  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    if ('onClick' in props && typeof props.onClick === 'function') {
      props.onClick(e)
    }
    navigate(to, options)
  }
  return (
    <Link
      href={('href' in props && typeof props.href === 'string' ? props.href : undefined) ?? getHrefFromTo(to)}
      {...props}
      onClick={handleClick}
    />
  )
}
