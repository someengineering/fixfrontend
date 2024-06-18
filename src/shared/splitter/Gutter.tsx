import type { MouseEvent, TouchEvent } from 'react'
import React from 'react'
import { GutterTheme, SplitDirection, isTouchDevice } from './index'

interface GutterProps {
  className?: string
  theme: GutterTheme
  draggerClassName?: string
  direction?: SplitDirection
  onDragging?: (e: MouseEvent | TouchEvent) => void
  nonce?: string
}

export const Gutter = React.forwardRef<HTMLDivElement, GutterProps>(
  ({ className, theme, draggerClassName, direction = SplitDirection.Vertical, onDragging, nonce }, ref) => {
    const containerClass = `__dbk__gutter ${direction} ${className || theme}`
    const draggerClass = `__dbk__dragger ${direction} ${draggerClassName || theme}`

    return (
      <div
        className={containerClass}
        ref={ref}
        dir={direction}
        onMouseDown={onDragging}
        onTouchStart={isTouchDevice ? onDragging : undefined}
        nonce={nonce}
      >
        <div className={draggerClass} />
      </div>
    )
  },
)
