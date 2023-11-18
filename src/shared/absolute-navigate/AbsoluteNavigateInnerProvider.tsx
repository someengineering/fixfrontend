import { PropsWithChildren, memo } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { AbsoluteNavigateContext } from './AbsoluteNavigateContext'

export const AbsoluteNavigateInnerProvider = memo(
  ({ useNavigate, children }: PropsWithChildren<{ useNavigate: NavigateFunction }>) => {
    return <AbsoluteNavigateContext.Provider value={useNavigate}>{children}</AbsoluteNavigateContext.Provider>
  },
  () => true,
)
