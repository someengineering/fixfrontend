import { UserContextRealValues } from 'src/core/auth/UserContext'
import { ThemeContextRealValues } from 'src/core/theme/ThemeContext'
import { StorageKeys } from 'src/shared/constants'

function getStorageObject<ReturnType = unknown>(key: StorageKeys) {
  const returnDataString = window.localStorage.getItem(key)
  if (returnDataString) {
    try {
      return JSON.parse(returnDataString) as ReturnType
    } catch {
      /* empty */
    }
  }
}

function setStorageObject<ObjectType>(key: StorageKeys, obj?: ObjectType) {
  if (obj) {
    window.localStorage.setItem(key, JSON.stringify(obj))
  } else {
    window.localStorage.removeItem(key)
  }
}

export const getAuthData = () => getStorageObject<UserContextRealValues>(StorageKeys.authData)

export const setAuthData = (authData?: UserContextRealValues) => setStorageObject(StorageKeys.authData, authData)

export const getLocale = () => getStorageObject<string>(StorageKeys.locale)

export const setLocale = (locale?: string) => setStorageObject(StorageKeys.locale, locale)

export const getInitiated = () => getStorageObject<boolean>(StorageKeys.initiated)

export const setInitiated = (initiated?: boolean) => setStorageObject(StorageKeys.initiated, initiated)

export const getThemeMode = () => getStorageObject<ThemeContextRealValues>(StorageKeys.themeMode)

export const setThemeMode = (themeMode?: ThemeContextRealValues) => setStorageObject(StorageKeys.themeMode, themeMode)
