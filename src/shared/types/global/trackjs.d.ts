// eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
import { TrackJS } from 'trackjs'

declare global {
  interface Window {
    _load_page_timeout: number | undefined
  }
}

// convert it into a module by adding an empty export statement.
export {}
