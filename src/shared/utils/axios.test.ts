import axios from 'axios'
import { axiosWithAuth, defaultAxiosConfig, setAxiosWithAuth, simpleAxios } from './axios'

type SimpleObject = Record<string | number | symbol, unknown>

describe('axios', () => {
  test('simpleAxios is valid', () => {
    const checkAxiosConfig = <T extends string | number | unknown[] | SimpleObject>(obj: T, value: T) => {
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          value.forEach((value, index) => {
            checkAxiosConfig((obj as unknown[])[index] as SimpleObject, value as SimpleObject)
          })
        } else {
          Object.entries(value).forEach(([key, value]) =>
            checkAxiosConfig((obj as SimpleObject)[key] as SimpleObject, value as SimpleObject),
          )
        }
      } else if (typeof value !== 'function') {
        expect(obj).toBe(value)
      }
    }
    checkAxiosConfig(simpleAxios.defaults, defaultAxiosConfig as unknown as SimpleObject)
  })

  test('setAxiosWithAuth should set correctly', () => {
    const instance = axios.create()
    setAxiosWithAuth(instance)
    expect(axiosWithAuth).toBe(instance)
  })
})
