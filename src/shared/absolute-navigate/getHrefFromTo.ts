import { To } from 'react-router-dom'
import { getAuthData } from 'src/shared/utils/localstorage'
import { handleRelationalPathname } from './handleRelationalPathname'

const checkHasHash = (hash?: string) => typeof hash === 'string' && hash !== 'undefined'

export const getHrefObjFromTo = (to: To) => {
  const selectedWorkspaceId = getAuthData()?.selectedWorkspaceId
  if (typeof to === 'object') {
    const hasHash = checkHasHash(to.hash)
    const newTo = {
      ...to,
      pathname: to.pathname ? handleRelationalPathname(to.pathname) : undefined,
      hash: hasHash ? to.hash : checkHasHash(selectedWorkspaceId) ? `#${selectedWorkspaceId}` : '',
      hasHash,
    }
    return newTo
  }
  const hashSplitted = to.split('#')
  const hasHash = checkHasHash(hashSplitted[1])
  const hash = (hasHash ? `#${hashSplitted[1]}` : undefined) ?? (checkHasHash(selectedWorkspaceId) ? `#${selectedWorkspaceId}` : '')
  const searchSplitted = hashSplitted[0].split('?')
  const search = searchSplitted[1] ? `?${searchSplitted[1]}` : ''
  const pathname = handleRelationalPathname(searchSplitted[0])
  return { pathname, search, hash, hasHash }
}

export const getHrefFromTo = (to: To) => {
  const { pathname, hash, search } = getHrefObjFromTo(to)
  return `${pathname}${search}${hash}`
}
