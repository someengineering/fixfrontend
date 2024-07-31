import { useContext } from 'react'
import { AbsoluteNavigateContext, NavigateFunction } from './AbsoluteNavigateContext'

export function useAbsoluteNavigate<Force extends boolean = false>(
  force?: Force,
): Force extends true ? NavigateFunction | undefined : NavigateFunction {
  const context = useContext(AbsoluteNavigateContext)
  if (!context) {
    if (force) {
      return undefined as Force extends true ? undefined : NavigateFunction
    }
    throw new Error('useAbsoluteNavigate must be used inside the AbsoluteNavigateProvider')
  }
  return context
}
