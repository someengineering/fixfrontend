import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContainer } from './containers/auth'
import { MainContainer } from './containers/main'
import { AuthGuard } from './core/auth'
import { Loading } from './shared/loading'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="login/*" element={<AuthContainer />} />
            <Route path="/*" element={<MainContainer />} />
          </Routes>
        </Suspense>
      </AuthGuard>
    </BrowserRouter>
  )
}
