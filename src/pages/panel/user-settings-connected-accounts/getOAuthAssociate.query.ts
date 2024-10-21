import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetOAuthAssociatesResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getOAuthAssociateQuery = async ({
  signal,
  queryKey: [_, returnUrl],
}: QueryFunctionContext<['oauth-associate', string, string | undefined]>) => {
  return axiosWithAuth
    .get<GetOAuthAssociatesResponse>(endPoints.auth.oauthAssociate, { signal, params: { redirect_url: returnUrl } })
    .then((res) => res.data)
}
