import { t } from '@lingui/macro'
import { OAuthProviderNames } from 'src/shared/types/server-shared'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

export const getNameFromOAuthType = (name: OAuthProviderNames, isSignup?: boolean) => {
  const formattedName = snakeCaseToUFStr(name)
  return isSignup ? t`Sign up with ${formattedName}` : t`Log in with ${formattedName}`
}
