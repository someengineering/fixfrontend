import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navigate } from 'src/shared/absolute-navigate'

const ChooseWorkspacePage = lazy(
  () =>
    import(
      /* webpackChunkName: "choose-workspace" */
      'src/pages/subscription/choose-workspace/ChooseWorkspacePage'
    ),
)

export function SubscriptionRoutes() {
  return (
    <Routes>
      <Route path="/choose-workspace" element={<ChooseWorkspacePage />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}
