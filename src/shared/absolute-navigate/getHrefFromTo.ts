import { To } from 'react-router-dom'
import { getAuthData } from 'src/shared/utils/localstorage'
import { handleRelationalPathname } from './handleRelationalPathname'

export const getHrefObjFromTo = (to: To) => {
  const selectedWorkspaceId = getAuthData()?.selectedWorkspaceId
  if (typeof to === 'object') {
    const newTo = {
      ...to,
      pathname: to.pathname ? handleRelationalPathname(to.pathname) : undefined,
      hash: to.hash ?? (selectedWorkspaceId ? `#${selectedWorkspaceId}` : undefined),
      hasHash: !!to.hash,
    }
    return newTo
  }
  const hashSplitted = to.split('#')
  const hash = (hashSplitted[1] ? `#${hashSplitted[1]}` : undefined) ?? (selectedWorkspaceId ? `#${selectedWorkspaceId}` : '')
  const searchSplitted = hashSplitted[0].split('?')
  const search = searchSplitted[1] ? `?${searchSplitted[1]}` : ''
  const pathname = handleRelationalPathname(searchSplitted[0])
  return { pathname, search, hash, hasHash: !!hashSplitted[1] }
}

export const getHrefFromTo = (to: To) => {
  const { pathname, hash, search } = getHrefObjFromTo(to)
  return `${pathname}${search}${hash}`
}
