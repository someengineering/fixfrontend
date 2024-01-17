import { createContext } from 'react'

export type ThemeContextRealValues = {
  mode: 'light' | 'dark'
}

export interface ThemeContextValue extends Partial<ThemeContextRealValues> {
  toggleColorMode: (themeMode?: 'light' | 'dark') => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
