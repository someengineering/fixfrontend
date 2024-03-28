import { AppRouter } from './AppRouter'
import { Providers } from './shared/providers'

interface AppProps {
  nonce?: string
}

export const App = ({ nonce }: AppProps) => {
  return (
    <Providers nonce={nonce}>
      <AppRouter />
    </Providers>
  )
}
