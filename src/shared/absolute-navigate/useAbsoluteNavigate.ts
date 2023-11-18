import { useContext } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { AbsoluteNavigateContext } from './AbsoluteNavigateContext'

export function useAbsoluteNavigate(): NavigateFunction {
  const context = useContext(AbsoluteNavigateContext)
  if (!context) {
    throw new Error('useAbsoluteNavigate must be used inside the AbsoluteNavigateProvider')
  }
  return context
}
