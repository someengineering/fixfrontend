import { createContext } from 'react'
import { NavigateOptions, To } from 'react-router-dom'

export type NavigateFunction = (to: To | number, options?: NavigateOptions & { noAutoHash?: boolean }) => void

export const AbsoluteNavigateContext = createContext<NavigateFunction | null>(null)
