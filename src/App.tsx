import { AppRouter } from './AppRouter'
import { CookieConsent } from './shared/cookie-consent'
import { PosthogPageView } from './shared/posthog'
import { Providers } from './shared/providers'

interface AppProps {
  nonce?: string
}

export const App = ({ nonce }: AppProps) => {
  return (
    <Providers nonce={nonce}>
      <AppRouter />
      <CookieConsent />
      <PosthogPageView />
    </Providers>
  )
}
