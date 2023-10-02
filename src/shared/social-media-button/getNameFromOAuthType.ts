import { t } from '@lingui/macro'
import { OAuthProviderNames } from 'src/shared/types/server'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

export const getNameFromOAuthType = (name: OAuthProviderNames, isSignup?: boolean) => {
  const formattedName = snakeCaseToUFStr(name)
  return isSignup ? t`Sign up With ${formattedName}` : t`Log In With ${formattedName}`
}
