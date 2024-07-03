import { Outlet } from 'react-router-dom'
import { SubscriptionCheckGuard } from './SubscriptionCheckGuard'

export const PreLoadCheckGuard = () => {
  return (
    <SubscriptionCheckGuard>
      <Outlet />
    </SubscriptionCheckGuard>
  )
}
