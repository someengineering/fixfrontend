import { AppRouter } from './AppRouter'
import { Providers } from './shared/providers'

export const App = ({ nonce }: { nonce?: string }) => {
  return (
    <Providers nonce={nonce}>
      <AppRouter />
    </Providers>
  )
}
