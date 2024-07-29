import { useContext } from 'react'
import { NonceContext } from './NonceProvider'

export { BasicProviders } from './BasicProviders'
export { i18n } from './i18n'
export { Providers } from './Providers'

export const useNonce = () => useContext(NonceContext)
