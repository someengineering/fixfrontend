import { Dispatch } from 'react'
import { DataEventTypes } from './GoogleTagManagerTypes'

export let gtmDispatch: Dispatch<DataEventTypes> = (_) => {}

export let gtmId: string = ''

export const setGTMDispatch = (dispatch: Dispatch<DataEventTypes>, id: string) => {
  gtmDispatch = dispatch
  gtmId = id
}
