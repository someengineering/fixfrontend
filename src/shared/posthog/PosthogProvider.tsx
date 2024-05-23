import posthog from 'posthog-js'
import { PostHogProvider as Provider } from 'posthog-js/react'
import { useEffect } from 'react'
import { env } from 'src/shared/constants'

export const PosthogProvider = ({ projectApiKey, children }: { projectApiKey?: string; children: React.ReactNode }) => {
  useEffect(() => {
    if (projectApiKey && !posthog.__loaded) {
      posthog.init(projectApiKey, {
        api_host: env.posthogApiHost,
        ui_host: env.posthogUiHost,
        cross_subdomain_cookie: !!env.isProd,
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
  }, [projectApiKey])

  return <Provider client={posthog}>{children}</Provider>
}
