import { UserContextRealValues } from 'src/core/auth'
export const authResponseToContext = (accessToken: string) => {
  const returnContext: UserContextRealValues = {
    token: accessToken,
    tokenType: 'Bearer',
    tokenExpireTimestamp: JSON.parse(window.atob(accessToken.split('.')[1])).exp * 1000,
  }
  return returnContext
}
