import origAxios, { AxiosInstance, CreateAxiosDefaults } from 'axios'
import { env } from 'src/shared/constants'

export const defaultAxiosConfig: CreateAxiosDefaults = {
  baseURL: `${env.apiUrl}/`,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
    'X-FIX-CSRF': 1,
  },
}

export const simpleAxios = origAxios.create(defaultAxiosConfig)

export let axiosWithAuth: AxiosInstance = simpleAxios

export const setAxiosWithAuth = (instance: AxiosInstance) => {
  axiosWithAuth = instance
}
