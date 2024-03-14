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

const VerifyEmailPage = lazy(
  () =>
    import(
      /* webpackChunkName: "verify-email" */
      'src/pages/auth/verify-email/VerifyEmailPage'
    ),
)

const ForgotPasswordPage = lazy(
  () =>
    import(
      /* webpackChunkName: "forgot-password" */
      'src/pages/auth/forgot-password/ForgotPasswordPage'
    ),
)

const ResetPasswordPage = lazy(
  () =>
    import(
      /* webpackChunkName: "reset-password" */
      'src/pages/auth/reset-password/ResetPasswordPage'
    ),
)

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}
