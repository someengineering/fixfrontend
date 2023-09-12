import isPropValid from '@emotion/is-prop-valid'

export const shouldForwardProp = (prop: string) => isPropValid(prop)

export const shouldForwardPropWithWhiteList = (prop: string, whiteList?: string[]) => (prop: string) =>
  whiteList?.includes(prop) || shouldForwardProp(prop)
