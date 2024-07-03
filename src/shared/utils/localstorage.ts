// for circular dependency workaround
// eslint-disable-next-line no-restricted-imports
import { ThemeContextRealValues } from 'src/core/theme/ThemeContext'
import { SettingsStorageKey, StorageKeys } from 'src/shared/constants'

function getStorageObject<ReturnType = unknown>(key: StorageKeys) {
  const returnDataString = window.localStorage.getItem(key)
  if (returnDataString) {
    try {
      return JSON.parse(returnDataString) as ReturnType
    } catch {
      return undefined
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

export const getAuthData = () => {
  const data = getStorageObject<{ isAuthenticated: boolean; selectedWorkspaceId: string; lastWorkingWorkspaceId?: string }>(
    StorageKeys.authData,
  )
  return {
    ...data,
    selectedWorkspaceId: window.location.hash?.substring(1) || data?.selectedWorkspaceId,
  }
}

export const setAuthData = (authData?: { isAuthenticated: boolean; selectedWorkspaceId?: string; lastWorkingWorkspaceId?: string }) => {
  setStorageObject(StorageKeys.authData, authData)
  window.location.hash = authData?.selectedWorkspaceId ?? ''
}

export const getLocale = () => getStorageObject<string>(StorageKeys.locale)

export const setLocale = (locale?: string) => setStorageObject(StorageKeys.locale, locale)

export const getInitiated = () => getStorageObject<boolean>(StorageKeys.initiated)

export const setInitiated = (initiated?: boolean) => setStorageObject(StorageKeys.initiated, initiated)

export const getSubscriptionId = () => getStorageObject<string>(StorageKeys.subscriptionId)

export const setSubscriptionId = (subscriptionId?: string) => setStorageObject(StorageKeys.subscriptionId, subscriptionId)

export const getThemeMode = () => getStorageObject<ThemeContextRealValues>(StorageKeys.themeMode)

export const setThemeMode = (themeMode?: ThemeContextRealValues) => setStorageObject(StorageKeys.themeMode, themeMode)

export const getSettings = <Type = unknown>(name: SettingsStorageKey) =>
  getStorageObject<Record<string, Type>>(StorageKeys.settings)?.[name]

export const setSettings = <Type = unknown>(name: SettingsStorageKey, data: Type) => {
  const prevData = getStorageObject<Record<string, Type>>(StorageKeys.settings) ?? {}
  setStorageObject(StorageKeys.settings, { ...prevData, [name]: data })
}
