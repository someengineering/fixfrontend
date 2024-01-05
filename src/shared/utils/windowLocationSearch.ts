export const getLocationSearchValues = (search = window.location.search) =>
  (search[0] === '?' ? search.substring(1) : search).split('&').reduce(
    (prev, cur) => {
      const splitted = cur.split('=')
      prev[splitted[0]] = splitted[1]
      return prev
    },
    {} as Record<string, string>,
  )

export const mergeLocationSearchValues = (search: Record<string, string>) =>
  `?${Object.entries(search)
    .map(([key, value]) => (value ? `${key}=${value}` : null))
    .filter((i) => i)
    .join('&')}`
