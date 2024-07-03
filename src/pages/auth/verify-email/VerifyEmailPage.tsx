import { useSuspenseQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ErrorBoundary } from 'react-error-boundary'
import { useSearchParams } from 'react-router-dom'
import { Navigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { verifyEmailQuery } from './verifyEmail.query'

interface VerifyEmailProps {
  token?: string
  redirectUrl: string
}

const VerifyEmail = ({ token, redirectUrl }: VerifyEmailProps) => {
  const { data: email } = useSuspenseQuery({ queryKey: ['verify-email', token], queryFn: token ? verifyEmailQuery : () => '' })

  return (
    <Navigate
      to={{
        pathname: '/auth/login',
        search: token
          ? email
            ? `?email=${window.encodeURIComponent(email)}&verified=true&returnUrl=${encodeURIComponent(redirectUrl)}`
            : undefined
          : undefined,
      }}
    />
  )
}

export default function VerifyEmailPage() {
  const [getSearch] = useSearchParams()

  const token = getSearch.get('token') ?? undefined
  const redirectUrl = getSearch.get('redirectUrl') ?? panelUI.homePage

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        const axiosError = ((error as AxiosError)?.response?.data as { detail: string })?.detail
        return (
          <Navigate
            to={{
              pathname: '/auth/login',
              search: axiosError
                ? `?error=${window.encodeURIComponent(axiosError)}&returnUrl=${window.encodeURIComponent(redirectUrl)}`
                : undefined,
            }}
          />
        )
      }}
    >
      <VerifyEmail redirectUrl={redirectUrl} token={token} />
    </ErrorBoundary>
  )
}
