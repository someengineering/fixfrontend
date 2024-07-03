import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { SettingsStorageKey } from 'src/shared/constants'
import { getSettings, setSettings } from './localstorage'

type SimpleTypes = number | string | boolean | undefined

export function usePersistState<StateType extends SimpleTypes | SimpleTypes[]>(
  name: SettingsStorageKey,
  initialState: StateType | (() => StateType),
  checkCorrectness?: (state: StateType) => boolean,
): [StateType, Dispatch<SetStateAction<StateType>>]
export function usePersistState<StateType extends SimpleTypes | SimpleTypes[] = undefined>(
  name: SettingsStorageKey,
): [StateType | undefined, Dispatch<SetStateAction<StateType | undefined>>]
export function usePersistState<StateType extends SimpleTypes | SimpleTypes[] = undefined>(
  name: SettingsStorageKey,
  initialState?: StateType | (() => StateType),
  checkCorrectness?: (state: StateType) => boolean,
): [StateType | undefined, Dispatch<SetStateAction<StateType | undefined>>] {
  const [state, setState] = useState<StateType | undefined>(() => {
    let setting = getSettings<StateType>(name)
    if (checkCorrectness && setting && !checkCorrectness(setting)) {
      setting = undefined
    }
    return setting ?? (typeof initialState === 'function' ? initialState() : initialState)
  })
  const setNewState = useCallback(
    (newState) => {
      setState((prevState) => {
        const result =
          typeof newState === 'function' ? (newState as (prevState: StateType | undefined) => StateType | undefined)(prevState) : newState
        if (result && checkCorrectness && !checkCorrectness(result)) {
          return prevState
        }
        window.setTimeout(() => {
          setSettings(name, result)
        })
        return result
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  ) as React.Dispatch<React.SetStateAction<StateType | undefined>>

  return [state, setNewState]
}
