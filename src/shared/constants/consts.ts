import { t } from '@lingui/macro'
import { SeverityType } from 'src/shared/types/server'

export const sortedSeverities: SeverityType[] = ['critical', 'high', 'medium', 'low', 'info']
export const panelMessages = () =>
  [{ message: 'aws-marketplace-subscribed', text: t`AWS Marketplace has been successfully subscribed`, type: 'success' }] as const
