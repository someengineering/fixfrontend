import origAxios, { AxiosInstance } from 'axios'
import { env } from 'src/shared/constants'

export const simpleAxios = origAxios.create({
  baseURL: env.apiUrl,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
})

export let axiosWithAuth: AxiosInstance = simpleAxios

export const setAxiosWithAuth = (instance: AxiosInstance) => {
  axiosWithAuth = instance
}
