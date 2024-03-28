import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { getSettings, setSettings } from './localstorage'

export function usePersistState<StateType>(
  name: string,
  initialState: StateType | (() => StateType),
): [StateType, Dispatch<SetStateAction<StateType>>]
export function usePersistState<StateType = undefined>(
  name: string,
): [StateType | undefined, Dispatch<SetStateAction<StateType | undefined>>]
export function usePersistState<StateType = undefined>(
  name: string,
  initialState?: StateType | (() => StateType),
): [StateType | undefined, Dispatch<SetStateAction<StateType | undefined>>] {
  const [state, setState] = useState<StateType | undefined>(
    () => getSettings<StateType>(name) ?? (typeof initialState === 'function' ? (initialState as () => StateType)() : initialState),
  )
  const setNewState = useCallback(
    (newState) => {
      setState((prevState) => {
        const result =
          typeof newState === 'function' ? (newState as (prevState: StateType | undefined) => StateType | undefined)(prevState) : newState
        window.setTimeout(() => {
          setSettings(name, result)
        })
        return result
      })
    },
    [name],
  ) as React.Dispatch<React.SetStateAction<StateType | undefined>>

  return [state, setNewState]
}
