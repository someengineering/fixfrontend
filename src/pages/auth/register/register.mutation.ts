import { endPoints } from 'src/shared/constants'
import { simpleAxios } from 'src/shared/utils/axios'

export const registerMutation = async ({ email, password, redirectUrl }: { email: string; password: string; redirectUrl: string }) => {
  return simpleAxios.post<string>(endPoints.auth.register, { email, password }, { params: { redirectUrl } }).then((res) => res.data)
}
