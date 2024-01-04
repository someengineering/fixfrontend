import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

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
