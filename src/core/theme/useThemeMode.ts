import { useContext } from 'react'
import { ThemeContext, ThemeContextValue } from './ThemeContext'

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used inside the Theme')
  }
  return context
}
