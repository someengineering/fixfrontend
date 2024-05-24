import { useSuspenseQuery } from '@tanstack/react-query'
import posthog from 'posthog-js'
import { PostHogProvider as Provider } from 'posthog-js/react'
import { useEffect } from 'react'
import { env } from 'src/shared/constants'
import { getEnvironmentQuery } from './getEnvironment.query'

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: { aws_marketplace_url, environment },
  } = useSuspenseQuery({
    queryKey: ['environment'],
    queryFn: getEnvironmentQuery,
    refetchInterval: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  })
  useEffect(() => {
    const projectApiKey =
      environment === 'prd' ? import.meta.env.VITE_POSTHOG_PROD_PROJECT_API_KEY : import.meta.env.VITE_POSTHOG_DEV_PROJECT_API_KEY
    env.isProd = environment === 'prd'
    env.aws_marketplace_url = aws_marketplace_url
    if (projectApiKey && !posthog.__loaded) {
      posthog.init(projectApiKey, {
        api_host: env.postHogApiHost,
        ui_host: env.postHogUiHost,
        cross_subdomain_cookie: env.isProd,
        secure_cookie: !env.isLocal,
        debug: env.isLocal,
        capture_pageview: false, // Page views are captured manually
        capture_pageleave: true,

        opt_out_persistence_by_default: true,
        opt_out_capturing_by_default: true,

        disable_session_recording: true,
        disable_surveys: true,
        enable_recording_console_log: false,
      })
    }
  }, [aws_marketplace_url, environment])

  return <Provider client={posthog}>{children}</Provider>
}
