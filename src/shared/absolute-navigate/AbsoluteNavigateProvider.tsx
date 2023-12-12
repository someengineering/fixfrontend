import { useLingui } from '@lingui/react'
import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useThemeMode } from 'src/core/theme'
import { useGTMDispatch } from 'src/shared/google-tag-manager'
import { getAuthData } from 'src/shared/utils/localstorage'
import { AbsoluteNavigateInnerProvider } from './AbsoluteNavigateInnerProvider'

export const AbsoluteNavigateProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode } = useThemeMode()
  const {
    i18n: { locale },
  } = useLingui()
  const sendToGTM = useGTMDispatch()

  useEffect(() => {
    const { isAuthenticated, selectedWorkspace } = getAuthData() || {}
    sendToGTM({
      event: 'page',
      hash: location.hash,
      language: locale.replace('-', '_'),
      path: location.pathname,
      search: location.search,
      state: JSON.stringify(location.state),
      workspaceId: selectedWorkspace || 'unknown',
      darkMode: mode === 'dark',
      authorized: isAuthenticated || false,
    })
  }, [location, locale, sendToGTM, mode])

  return <AbsoluteNavigateInnerProvider useNavigate={navigate}>{children}</AbsoluteNavigateInnerProvider>
}
