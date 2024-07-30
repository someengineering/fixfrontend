import { To } from 'react-router-dom'

// export const createInventorySearchTo = (crit: string, change?: boolean) => {
//   const currentDate = new Date()
//   return {
//     pathname: `/inventory/${change ? 'history' : 'search'}`,
//     search: `?q=${window.encodeURIComponent(crit)}${
//       change
//         ? `&before=${currentDate.toISOString()}&after=${new Date(
//             currentDate.valueOf() - 1000 * 60 * 60 * 24 * 7,
//           ).toISOString()}&changes=node_compliant,node_vulnerable`
//         : ''
//     }`,
//   } as To
// }

// TODO: above method should change after changing the route

export const createInventorySearchTo = (crit: string, change?: boolean) => {
  const currentDate = new Date()
  return {
    pathname: `/inventory${change ? '/history' : ''}`,
    search: `?q=${window.encodeURIComponent(crit)}${
      change
        ? `&before=${currentDate.toISOString()}&after=${new Date(
            currentDate.valueOf() - 1000 * 60 * 60 * 24 * 7,
          ).toISOString()}&changes=node_compliant,node_vulnerable`
        : ''
    }`,
  } as To
}
