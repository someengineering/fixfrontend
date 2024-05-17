import { Navigate, Outlet } from 'react-router-dom'
import { Permissions } from 'src/core/auth'
import { panelUI } from 'src/shared/constants'
import { usePermissionCheck } from './check-hooks'

export const PermissionCheckGuard = ({ permissionToCheck }: { permissionToCheck: Permissions }) => {
  const hasPermission = usePermissionCheck(permissionToCheck)

  return hasPermission ? (
    <Outlet />
  ) : (
    <Navigate to={{ pathname: panelUI.homePage, search: window.location.search, hash: window.location.hash }} replace />
  )
}
