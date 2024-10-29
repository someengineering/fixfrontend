import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import { UserRole } from 'src/shared/types/server-shared'

export const roleOptions: { role: keyof UserRole; name: ReactNode }[] = [
  { role: 'owner', name: <Trans>Owner</Trans> },
  { role: 'admin', name: <Trans>Admin</Trans> },
  { role: 'billing_admin', name: <Trans>Billing Admin</Trans> },
  { role: 'member', name: <Trans>Member</Trans> },
]
