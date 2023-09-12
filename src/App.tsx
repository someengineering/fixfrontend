import { AppRouter } from './AppRouter'
import { Providers } from './shared/utils/Providers'

export const App = () => {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}
