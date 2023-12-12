import { Dispatch } from 'react'
import { DataEventTypes } from './GoogleTagManagerTypes'

export let gtmDispatch: Dispatch<DataEventTypes> = (_) => {}

export const setGTMDispatch = (dispatch: Dispatch<DataEventTypes>) => {
  gtmDispatch = dispatch
}
