import { PropsWithChildren, memo } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { AbsoluteNavigateContext } from './AbsoluteNavigateContext'

interface AbsoluteNavigateInnerProviderProps extends PropsWithChildren {
  useNavigate: NavigateFunction
  workspaceId: string
}

export const AbsoluteNavigateInnerProvider = memo(
  ({ useNavigate, children }: AbsoluteNavigateInnerProviderProps) => {
    return <AbsoluteNavigateContext.Provider value={useNavigate}>{children}</AbsoluteNavigateContext.Provider>
  },
  (prev, next) => prev.workspaceId === next.workspaceId,
)
