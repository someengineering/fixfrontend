import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { env } from 'src/shared/constants'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: (failureCount, error) => {
        if ((((error as AxiosError)?.response?.status || (error as AxiosError)?.status) ?? 500) / 100 < 5) {
          return false
        }
        return failureCount < env.retryCount
      },
      staleTime: 1000 * 60 * 5,
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})
