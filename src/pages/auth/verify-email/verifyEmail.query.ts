import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { simpleAxios } from 'src/shared/utils/axios'

export const verifyEmailQuery = ({ signal, queryKey: [, token] }: QueryFunctionContext<['verify-email', string | undefined]>) => {
  return simpleAxios.post<{ email: string }>(endPoints.auth.verify, { token }, { signal }).then((res) => res.data.email)
}
