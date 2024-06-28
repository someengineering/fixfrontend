import { PropsWithChildren, useEffect } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { getSubscriptionId } from 'src/shared/utils/localstorage'
import { TrialPeriodEndedCheckGuard } from './TrialPeriodEndedCheckGuard'

export const SubscriptionCheckGuard = ({ children }: PropsWithChildren) => {
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

  return <TrialPeriodEndedCheckGuard>{children}</TrialPeriodEndedCheckGuard>
}
