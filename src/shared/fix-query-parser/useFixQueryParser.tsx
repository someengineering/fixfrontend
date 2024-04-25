import { useContext } from 'react'
import { FixQueryContext, FixQueryContextValue } from './FixQueryContext'

export function useFixQueryParser(doNotThrowError?: false): FixQueryContextValue
export function useFixQueryParser(doNotThrowError?: true): FixQueryContextValue | null
export function useFixQueryParser(doNotThrowError?: boolean) {
  const context = useContext(FixQueryContext)
  if (!context && !doNotThrowError) {
    throw new Error('useFixQueryParser must be used inside the FixQueryProvider')
  }
  return context
}
