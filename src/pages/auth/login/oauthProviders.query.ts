import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { OAuthProvidersResponse } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const oauthProvidersQuery = async ({ signal }: QueryFunctionContext) => {
  return await simpleAxios
    .get<OAuthProvidersResponse>(endPoints.auth.oauthProviders, {
      signal,
    })
    .then((response) => response?.data)
}
