import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmailQuery } from './verifyEmail.query'

export default function VerifyPage() {
  const [getSearch] = useSearchParams()
  const token = getSearch.get('token') ?? undefined
  const redirectUrl = getSearch.get('redirectUrl') ?? '/'
  const { data: email, error } = useQuery({ queryKey: ['verify-email', token], queryFn: verifyEmailQuery, enabled: !!token })
  const navigate = useNavigate()
  useEffect(() => {
    const axiosError = ((error as AxiosError)?.response?.data as { detail: string })?.detail
    if (email || axiosError) {
      navigate({
        pathname: '/auth/login',
        search: email
          ? `?email=${window.encodeURIComponent(email)}&verified=true&returnUrl=${encodeURIComponent(redirectUrl)}`
          : axiosError
          ? `?error=${window.encodeURIComponent(axiosError)}&returnUrl=${window.encodeURIComponent(redirectUrl)}`
          : undefined,
      })
    }
  }, [email, error, navigate, redirectUrl])
  return null
}
