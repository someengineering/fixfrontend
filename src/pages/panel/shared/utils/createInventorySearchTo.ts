import { To } from 'react-router-dom'

export const createInventorySearchTo = (crit: string, change?: boolean) => {
  const currentDate = new Date()
  return {
    pathname: '/inventory',
    search: `?q=${window.encodeURIComponent(crit)}${
      change
        ? `&before=${currentDate.toISOString()}&after=${new Date(
            currentDate.valueOf() - 1000 * 60 * 60 * 24 * 7,
          ).toISOString()}&changes=node_compliant,node_vulnerable`
        : ''
    }`,
  } as To
}
