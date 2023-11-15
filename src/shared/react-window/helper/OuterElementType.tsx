import { forwardRef, useContext } from 'react'
import { OuterElementContext } from './OuterElementContext'

export const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})
