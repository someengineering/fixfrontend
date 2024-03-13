import { useContext } from 'react'
import { NonceContext } from './NonceProvider'

export { BasicProviders } from './BasicProviders'
export { Providers } from './Providers'
export { i18n } from './i18n'

export const useNonce = () => useContext(NonceContext)
