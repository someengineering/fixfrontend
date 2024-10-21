import { AxiosError } from 'axios'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteOAuthAssociateMutation = async (provider_id: string) => {
  return axiosWithAuth
    .delete<null>(endPoints.auth.oauthAccounts(provider_id))
    .then(() => undefined)
    .catch((err) => {
      if ((err as AxiosError).response?.status !== 403) {
        return undefined
      } else {
        throw err
      }
    })
}
