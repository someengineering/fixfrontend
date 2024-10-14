import { Link, LinkProps, LinkTypeMap } from '@mui/material'
import { ElementType, MouseEvent as ReactMouseEvent, useTransition } from 'react'
import { NavigateOptions, To } from 'react-router-dom'
import { getHrefFromTo, useAbsoluteNavigate } from 'src/shared/absolute-navigate'

type InternalLinkProps<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown> = LinkProps<
  RootComponent,
  AdditionalProps
> & {
  to: To
  withTransition?: boolean
  options?: NavigateOptions
}

function InternalLinkWithTransition<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown>({
  to,
  options,
  ...props
}: Omit<InternalLinkProps<RootComponent, AdditionalProps>, 'withTransition'>) {
  const navigate = useAbsoluteNavigate()
  const [_, startTransition] = useTransition()
  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    if ('onClick' in props && typeof props.onClick === 'function') {
      props.onClick(e)
    }
    startTransition(() => navigate(to, options))
  }
  return (
    <Link
      href={('href' in props && typeof props.href === 'string' ? props.href : undefined) ?? getHrefFromTo(to)}
      {...props}
      onClick={handleClick}
    />
  )
}

function InternalLinkWithoutTransition<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown>({
  to,
  options,
  ...props
}: Omit<InternalLinkProps<RootComponent, AdditionalProps>, 'withTransition'>) {
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

export function InternalLink<RootComponent extends ElementType = LinkTypeMap['defaultComponent'], AdditionalProps = unknown>({
  withTransition,
  ...props
}: InternalLinkProps<RootComponent, AdditionalProps>) {
  return withTransition ? (
    <InternalLinkWithTransition<RootComponent, AdditionalProps> {...props} />
  ) : (
    <InternalLinkWithoutTransition<RootComponent, AdditionalProps> {...props} />
  )
}
