import { PropsWithChildren, memo } from 'react'
import { AbsoluteNavigateContext, NavigateFunction } from './AbsoluteNavigateContext'

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
