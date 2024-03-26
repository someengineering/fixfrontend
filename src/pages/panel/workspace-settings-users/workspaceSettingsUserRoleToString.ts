import { t } from '@lingui/macro'
import { UserRole } from 'src/shared/types/server'

export const workspaceSettingsUserRoleToString = (role: UserRole) => {
  const roles = [] as string[]
  if (role.owner) {
    roles.push(t`Owner`)
  }
  if (role.admin) {
    roles.push(t`Admin`)
  }
  if (role.billing_admin) {
    roles.push(t`Billing Admin`)
  }
  if (role.member) {
    roles.push(t`Member`)
  }
  return roles.length ? roles.join(', ') : t`Admin`
}
