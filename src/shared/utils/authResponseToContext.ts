import { UserContextRealValues } from 'src/core/auth'
export const authResponseToContext = () => {
  const returnContext: UserContextRealValues = {
    isAuthenticated: true,
    workspaces: [],
  }
  return returnContext
}
