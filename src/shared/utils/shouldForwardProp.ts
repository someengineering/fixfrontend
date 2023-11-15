// eslint-disable-next-line no-restricted-imports
import isPropValid from '@emotion/is-prop-valid'

export const shouldForwardProp = (prop: string) => isPropValid(prop)

export const shouldForwardPropWithWhiteList = (whiteList?: string[]) => (prop: string) =>
  whiteList?.includes(prop) || shouldForwardProp(prop)

export const shouldForwardPropWithBlackList = (blackList?: string[]) => (prop: string) =>
  !blackList?.includes(prop) || shouldForwardProp(prop)
