import { useContext } from 'react'
import { GTMContextDispatch } from './GoogleTagManager'

export const useGTMDispatch = () => {
  const context = useContext(GTMContextDispatch)
  if (context === undefined) {
    throw new Error('dispatchGTMEvent must be used within a GTMProvider')
  }

  return context
}
