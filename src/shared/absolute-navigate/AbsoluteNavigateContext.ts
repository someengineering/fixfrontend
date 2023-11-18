import { createContext } from 'react'
import { NavigateFunction } from 'react-router-dom'

export const AbsoluteNavigateContext = createContext<NavigateFunction | null>(null)
