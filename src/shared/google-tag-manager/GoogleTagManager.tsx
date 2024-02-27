import { ReactNode, createContext, useEffect, useReducer } from 'react'
import { DataEventTypes, SnippetsParams } from './GoogleTagManagerTypes'
import { gtmDispatch, setGTMDispatch } from './gtmDispatch'
import { initGTM } from './initGTM'
import { sendToGTM } from './sendToGTM'
import { userId } from './setGTMConfig'

declare global {
  interface Window {
    dataLayer: unknown[] | undefined
    [key: string]: unknown
  }
}

/**
 * The shape of the context provider
 */
type GTMHookProviderProps = { state?: SnippetsParams; children: ReactNode }

/**
 * The initial state
 */
const initialState: SnippetsParams = {
  dataLayer: undefined,
  dataLayerName: 'dataLayer',
  environment: undefined,
  nonce: undefined,
  id: '',
  injectScript: true,
}

/**
 * The context
 */
export const GTMContext = createContext<SnippetsParams | undefined>(initialState)
export const GTMContextDispatch = createContext<((data: DataEventTypes) => void) | undefined>(undefined)

function dataReducer(state: SnippetsParams, data: DataEventTypes) {
  data.user_id = userId
  sendToGTM({ data, dataLayerName: state?.dataLayerName ?? '' })
  return state
}

/**
 * The Google Tag Manager Provider
 */
export const GTMProvider = ({ state, children }: GTMHookProviderProps) => {
  const [store, dispatch] = useReducer(dataReducer, { ...initialState, ...state })

  useEffect(() => {
    if (!state || state.injectScript == false) return
    const mergedState = { ...initialState, ...state }

    initGTM(mergedState)
    setGTMDispatch(dispatch, mergedState.id)

    return () => {
      setGTMDispatch(() => {}, '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state)])

  return (
    <GTMContext.Provider value={store}>
      <GTMContextDispatch.Provider value={gtmDispatch}>{children}</GTMContextDispatch.Provider>
    </GTMContext.Provider>
  )
}
