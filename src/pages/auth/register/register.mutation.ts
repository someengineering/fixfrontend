import { endPoints } from 'src/shared/constants'
import { simpleAxios } from 'src/shared/utils/axios'

export const registerMutation = async ({ email, password }: { email: string; password: string }) => {
  return simpleAxios.post<string>(endPoints.auth.register, { email, password }).then((res) => res.data)
}
