import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from 'src/core/auth'

const HomePage = lazy(
  () =>
    import(
      /* webpackChunkName: "home" */
      'src/pages/home/HomePage'
    ),
)

export function MainRoutes() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/">
          <Route index element={<HomePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
