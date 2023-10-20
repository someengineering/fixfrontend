import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmailQuery } from './verifyEmail.query'

export default function VerifyPage() {
  const [getSearch] = useSearchParams()
  const token = getSearch.get('token') ?? undefined
  const { data: email, error } = useQuery(['verify-email', token], verifyEmailQuery, {
    enabled: !!token,
  })
  const navigate = useNavigate()
  useEffect(() => {
    const axiosError = ((error as AxiosError)?.response?.data as { detail: string })?.detail
    if (email || axiosError) {
      navigate({
        pathname: '/auth/login',
        search: email ? `?email=${email}&verified=true` : axiosError ? `?error=${axiosError}` : undefined,
      })
    }
  }, [email, error, navigate])
  return null
}
