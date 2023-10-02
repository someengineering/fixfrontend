import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { OAuthProvidersResponse } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const oauthProvidersQuery = async ({ signal, queryKey: [_, redirect_url] }: QueryFunctionContext<['LoginSocialMedia', string]>) => {
  return await simpleAxios
    .get<OAuthProvidersResponse>(endPoints.auth.oauthProviders, {
      signal,
      params: { redirect_url },
    })
    .then((response) => response?.data)
    .then((res) => new Promise<OAuthProvidersResponse>((resolve) => window.setTimeout(() => resolve(res), 3000)))
}
