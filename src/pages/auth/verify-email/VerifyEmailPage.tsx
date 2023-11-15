import { useSuspenseQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyEmailQuery } from './verifyEmail.query'

export default function VerifyPage() {
  const [getSearch] = useSearchParams()
  const token = getSearch.get('token') ?? undefined
  const redirectUrl = getSearch.get('redirectUrl') ?? '/'
  const { data: email, error } = useSuspenseQuery({ queryKey: ['verify-email', token], queryFn: token ? verifyEmailQuery : () => '' })
  const axiosError = ((error as AxiosError)?.response?.data as { detail: string })?.detail
  return (
    <Navigate
      to={{
        pathname: '/auth/login',
        search: token
          ? email
            ? `?email=${window.encodeURIComponent(email)}&verified=true&returnUrl=${encodeURIComponent(redirectUrl)}`
            : axiosError
              ? `?error=${window.encodeURIComponent(axiosError)}&returnUrl=${window.encodeURIComponent(redirectUrl)}`
              : undefined
          : undefined,
      }}
    />
  )
}
