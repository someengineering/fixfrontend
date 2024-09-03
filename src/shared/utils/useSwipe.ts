import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

export type SwipeDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export const getPointerCoordinates = (event: TouchEvent | MouseEvent): [number, number] => {
  if ('touches' in event) {
    const { clientX, clientY } = event.touches[0]
    return [clientX, clientY]
  }

  const { clientX, clientY } = event

  return [clientX, clientY]
}

export const useSwipe = ({
  ref,
  minThreshold = 100,
  threshold = 150,
  allowedTime = Number.POSITIVE_INFINITY,
  onSwipe,
}: {
  ref?: RefObject<HTMLElement>
  minThreshold?: number
  threshold?: number
  allowedTime?: number
  onSwipe?: (swipe: SwipeDirection, swipedCount: number) => void
} = {}) => {
  const [swipedCount, setSwipedCount] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>()
  const startingPointRef = useRef<[number, number]>([-1, -1])
  const startTimeRef = useRef<number>(0)
  const start = useCallback((e: MouseEvent | TouchEvent) => {
    startingPointRef.current = getPointerCoordinates(e)
    startTimeRef.current = new Date().getTime()
    e.preventDefault()
    e.stopPropagation()
  }, [])
  const move = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  const end = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const [startClientX, startClientY] = startingPointRef.current
      const [clientX, clientY] = getPointerCoordinates(e)
      const distX = Math.abs(clientX - startClientX)
      const distY = Math.abs(clientY - startClientY)
      const elapsedTime = new Date().getTime() - startTimeRef.current // get time elapsed
      startingPointRef.current = [-1, -1]
      startTimeRef.current = 0
      if (elapsedTime <= allowedTime) {
        const direction: SwipeDirection | undefined =
          distX >= threshold && distY <= minThreshold
            ? clientX > startClientX
              ? 'RIGHT'
              : 'LEFT'
            : distY >= threshold && distX <= minThreshold
              ? clientY > startClientY
                ? 'DOWN'
                : 'UP'
              : undefined
        if (direction) {
          setSwipeDirection(direction)
          setSwipedCount((prev) => {
            const newValue = prev + 1
            onSwipe?.(direction, newValue)
            return newValue
          })
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    [allowedTime, minThreshold, onSwipe, threshold],
  )
  useEffect(() => {
    if (ref && ref.current) {
      const el = ref.current
      el.addEventListener('mousedown', start)
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseup', end)
      el.addEventListener('mouseleave', end)
      el.addEventListener('touchstart', start)
      el.addEventListener('touchmove', move)
      el.addEventListener('touchend', end)
      el.addEventListener('touchcancel', end)
      return () => {
        if (el) {
          el.removeEventListener('mousedown', start)
          el.removeEventListener('mousemove', move)
          el.removeEventListener('mouseup', end)
          el.removeEventListener('mouseleave', end)
          el.removeEventListener('touchstart', start)
          el.removeEventListener('touchmove', move)
          el.removeEventListener('touchend', end)
          el.removeEventListener('touchcancel', end)
        }
      }
    }
  }, [end, move, ref, start])
  return { onTouchStart: start, onTouchMove: move, onTouchEnd: end, swipedCount, swipeDirection }
}
