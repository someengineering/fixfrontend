import { Button, ButtonProps, ButtonTypeMap } from '@mui/material'
import { ElementType, MouseEvent as ReactMouseEvent } from 'react'
import { NavigateOptions, To } from 'react-router-dom'
import { getHrefFromTo, useAbsoluteNavigate } from 'src/shared/absolute-navigate'

type InternalLinkButtonProps<
  RootComponent extends ElementType = ButtonTypeMap['defaultComponent'],
  AdditionalProps = unknown,
> = ButtonProps<RootComponent, AdditionalProps> & {
  to: To
  options?: NavigateOptions
}

export function InternalLinkButton<RootComponent extends ElementType = ButtonTypeMap['defaultComponent'], AdditionalProps = unknown>({
  to,
  options,
  href,
  ...props
}: InternalLinkButtonProps<RootComponent, AdditionalProps>) {
  const navigate = useAbsoluteNavigate()
  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(to, options)
  }
  return <Button href={href ?? getHrefFromTo(to)} onClick={handleClick} {...props} />
}
