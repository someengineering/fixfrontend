import { useUserProfile } from 'src/core/auth'

export const useHasBillingPermissionCheck = () => {
  const { selectedWorkspace } = useUserProfile()

  return selectedWorkspace?.permissions.includes('readBilling') ?? false
}
