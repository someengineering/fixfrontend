import { ThemeContextRealValues } from 'src/core/theme'
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

export const getAuthData = () => getStorageObject<{ isAuthenticated: boolean; selectedWorkspaceId: string }>(StorageKeys.authData)

export const setAuthData = (authData?: { isAuthenticated: boolean; selectedWorkspaceId?: string }) =>
  setStorageObject(StorageKeys.authData, authData)

export const getLocale = () => getStorageObject<string>(StorageKeys.locale)

export const setLocale = (locale?: string) => setStorageObject(StorageKeys.locale, locale)

export const getInitiated = () => getStorageObject<boolean>(StorageKeys.initiated)

export const setInitiated = (initiated?: boolean) => setStorageObject(StorageKeys.initiated, initiated)

export const getSubscriptionId = () => getStorageObject<string>(StorageKeys.subscriptionId)

export const setSubscriptionId = (subscriptionId?: string) => setStorageObject(StorageKeys.subscriptionId, subscriptionId)

export const getThemeMode = () => getStorageObject<ThemeContextRealValues>(StorageKeys.themeMode)

export const setThemeMode = (themeMode?: ThemeContextRealValues) => setStorageObject(StorageKeys.themeMode, themeMode)
