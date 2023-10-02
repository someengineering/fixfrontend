import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const LoginPage = lazy(
  () =>
    import(
      /* webpackChunkName: "login" */
      'src/pages/auth/login/LoginPage'
    ),
)

const RegisterPage = lazy(
  () =>
    import(
      /* webpackChunkName: "register" */
      'src/pages/auth/register/RegisterPage'
    ),
)

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  )
}
