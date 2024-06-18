import { useEffect } from 'react'

interface UseAddEventListenerOptions extends AddEventListenerOptions {
  condition: boolean
}

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (this: Window, ev: WindowEventMap[K]) => unknown,
  deps: unknown[] = [],
  useAddEventListenerOptions: UseAddEventListenerOptions = { condition: true },
) {
  const { condition, ...addEventListenerOptions } = useAddEventListenerOptions
  useEffect(() => {
    if (condition) {
      window.addEventListener<K>(event, handler, addEventListenerOptions)
    }
    return () => {
      if (condition) {
        window.removeEventListener(event, handler)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, handler, condition, ...deps])
}
