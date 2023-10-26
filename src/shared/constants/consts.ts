import { t } from '@lingui/macro'
import { WorkspaceFailedChecksTypeKeys } from 'src/shared/types/server'

export const sortedSeverities: WorkspaceFailedChecksTypeKeys[] = ['critical', 'high', 'medium', 'low']
export const panelMessages = () =>
  [{ message: 'aws-marketplace-subscribed', text: t`AWS Marketplace has been succesfully subscribed`, type: 'success' }] as const
