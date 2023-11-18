import { HTMLAttributes, forwardRef, useContext } from 'react'
import { OuterElementContext } from './OuterElementContext'

export const OuterElementType = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>((props, ref) => {
  const outerProps = useContext(OuterElementContext)
  return (
    <div
      ref={ref}
      {...props}
      {...outerProps}
      onScroll={(e) => {
        outerProps?.onScroll?.(e)
        props?.onScroll?.(e)
      }}
    />
  )
})
