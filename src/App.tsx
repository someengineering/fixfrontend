import { AppRouter } from './AppRouter'
import { Providers } from './shared/providers'

export const App = () => {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}
