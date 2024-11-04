import { Permissions, useUserProfile } from 'src/core/auth'

export const usePermissionCheck = (permissionToCheck?: Permissions) => {
  const { checkPermission } = useUserProfile()

  return permissionToCheck ? checkPermission(permissionToCheck) : true
}
