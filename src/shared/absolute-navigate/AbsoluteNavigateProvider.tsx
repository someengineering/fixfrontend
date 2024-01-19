import { useLingui } from '@lingui/react'
import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useThemeMode } from 'src/core/theme'
import { GTMEventNames } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { getAuthData } from 'src/shared/utils/localstorage'
import { AbsoluteNavigateInnerProvider } from './AbsoluteNavigateInnerProvider'

export const AbsoluteNavigateProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode } = useThemeMode()
  const {
    i18n: { locale },
  } = useLingui()

  useEffect(() => {
    const { isAuthenticated, selectedWorkspaceId } = getAuthData() || {}
    sendToGTM({
      event: GTMEventNames.Page,
      hash: location.hash,
      language: locale.replace('-', '_'),
      path: location.pathname,
      search: location.search,
      state: JSON.stringify(location.state),
      workspaceId: selectedWorkspaceId || 'unknown',
      darkMode: mode === 'dark',
      authorized: isAuthenticated || false,
    })
  }, [location, locale, mode])

  return <AbsoluteNavigateInnerProvider useNavigate={navigate}>{children}</AbsoluteNavigateInnerProvider>
}
