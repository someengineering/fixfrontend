import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetOAuthProvidersResponse } from 'src/shared/types/server'
import { simpleAxios } from 'src/shared/utils/axios'

export const getOAuthProvidersQuery = async ({
  signal,
  queryKey: [, redirect_url],
}: QueryFunctionContext<['LoginSocialMedia', string]>) => {
  return await simpleAxios
    .get<GetOAuthProvidersResponse>(endPoints.auth.oauthProviders, {
      signal,
      params: { redirect_url },
    })
    .then((response) => response?.data)
    .then((res) => new Promise<GetOAuthProvidersResponse>((resolve) => window.setTimeout(() => resolve(res), 3000)))
}
