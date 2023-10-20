import { createContext, useContext } from 'react'

export type ThemeContextRealValues = {
  mode: 'light' | 'dark'
}

export interface ThemeContextValue extends Partial<ThemeContextRealValues> {
  toggleColorMode: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used inside the Theme')
  }
  return context
}
