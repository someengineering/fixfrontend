import { MouseEvent, RefObject, useCallback, useEffect, useState } from 'react'

const apis = {
  noPrefix: {
    request: 'requestFullscreen',
    element: 'fullscreenElement',
    exit: 'exitFullscreen',
  },
  ms: {
    request: 'msRequestFullscreen' as 'requestFullscreen',
    element: 'msFullscreenElement' as 'fullscreenElement',
    exit: 'msExitFullscreen' as 'exitFullscreen',
  },
  moz: {
    request: 'mozRequestFullScreen' as 'requestFullscreen',
    element: 'mozFullScreenElement' as 'fullscreenElement',
    exit: 'mozCancelFullScreen' as 'exitFullscreen',
  },
  webkit: {
    request: 'webkitRequestFullscreen' as 'requestFullscreen',
    element: 'webkitFullscreenElement' as 'fullscreenElement',
    exit: 'webkitCancelFullScreen' as 'exitFullscreen',
  },
} as const

type ApisKeys = keyof typeof apis

const makeFullscreen = async (fullScreenEl?: HTMLElement | null) => {
  if (fullScreenEl) {
    for (const item in apis) {
      if (item in apis) {
        const api = apis[item as ApisKeys]

        if (fullScreenEl[api.request]) {
          if (window.document[api.element]) {
            return window.document[api.exit]()
          } else {
            return fullScreenEl[api.request]()
          }
        }
      }
    }
  }
}

export const useFullscreen = (fullScreenRef: RefObject<HTMLElement | null>, initialFullscreen: boolean = false) => {
  const [hasFullscreen, setHasFullscreen] = useState(initialFullscreen)
  const toggleFullscreen = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      return makeFullscreen(fullScreenRef.current)
    },
    [fullScreenRef],
  )
  useEffect(() => {
    if (initialFullscreen) {
      void makeFullscreen(fullScreenRef.current)
    }
    const handleFullscreenChange = () => setHasFullscreen(!!window.document.fullscreenElement)
    window.document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      window.document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [fullScreenRef, initialFullscreen])

  return [hasFullscreen, toggleFullscreen] as const
}
