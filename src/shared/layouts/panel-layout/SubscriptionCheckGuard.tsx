import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { getSubscriptionId } from 'src/shared/utils/localstorage'

export const SubscriptionCheckGuard = () => {
  const navigate = useAbsoluteNavigate()

  const subscriptionId = getSubscriptionId()

  useEffect(() => {
    if (subscriptionId !== undefined) {
      navigate(`/subscription/choose-workspace?subscription_id=${subscriptionId}`)
    }
  }, [navigate, subscriptionId])

  if (subscriptionId !== undefined) {
    return <FullPageLoadingSuspenseFallback />
  }

  return <Outlet />
}
