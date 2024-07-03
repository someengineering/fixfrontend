import { useLingui } from '@lingui/react'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useThemeMode } from 'src/core/theme'
import { isAuthenticated } from 'src/shared/utils/cookie'

export const PostHogPageView = () => {
  const posthog = usePostHog()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { currentUser, selectedWorkspace } = useUserProfile()
  const {
    i18n: { locale },
  } = useLingui()
  const { mode: theme } = useThemeMode()

  useEffect(() => {
    if (pathname && posthog) {
      const url = `${window.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

      posthog.capture('$pageview', {
        $current_url: url,
        $set: { ...currentUser },
        authenticated: isAuthenticated(),
        user_id: currentUser?.id,
        workspace_id: selectedWorkspace?.id,
        locale,
        theme,
      })
    }
  }, [pathname, searchParams, posthog, locale, theme, currentUser, selectedWorkspace])

  return null
}
