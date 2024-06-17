export const handleRelationalPathname = (pathname: string) => {
  let newPathname = pathname
  if (pathname?.startsWith('.')) {
    if (pathname === '.') {
      newPathname = window.location.pathname.split('?')[0]
    } else if (pathname.startsWith('./')) {
      newPathname = `${window.location.pathname.split('?')[0]}/${pathname.substring(2)}`
    } else if (pathname.startsWith('..')) {
      newPathname = pathname
      const oldPath = window.location.pathname.split('?')[0].split('/')
      while (newPathname.startsWith('..')) {
        newPathname = newPathname.substring(3)
        oldPath.pop()
      }
      newPathname = `${oldPath.join('/')}/${newPathname}`
    }
  }
  return newPathname.at(-1) === '/' ? newPathname.substring(0, newPathname.length - 1) : newPathname
}
