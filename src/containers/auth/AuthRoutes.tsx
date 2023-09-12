import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const LoginPage = lazy(
  () =>
    import(
      /* webpackChunkName: "login" */
      'src/pages/auth/login/LoginPage'
    ),
)

export function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
    </Routes>
  )
}
