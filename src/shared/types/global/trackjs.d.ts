import type { TrackJS } from 'trackjs'

declare global {
  interface Window {
    _load_page_timeout: number | undefined
    TrackJS: typeof TrackJS | undefined
  }
}

// convert it into a module by adding an empty export statement.
export {}
