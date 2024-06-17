// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest'
import querystring from 'querystring'

const location = {
  ...global.location,
  hostname: 'localhost',
  pathname: '/',
  hash: '',
  origin: `${import.meta.env.VITE_SERVER}`,
}

global.location = {
  ...global.location,
  ...location,
}

// @ts-expect-error for minimal implementation of window
global.window = {
  ...global,
  location: {
    ...global.location,
    ...location,
  },
  localStorage: (() => {
    let items = {} as Record<string, string>
    return {
      setItem: (key, value) => {
        items[key] = value
      },
      getItem: (key) => items[key],
      length: Object.keys(items).length,
      clear: () => {
        items = {}
      },
      key: (index) => Object.values(items)[index],
      removeItem: (key) => {
        delete items[key]
      },
    }
  })(),
  encodeURIComponent: (uriComponent: string | number | boolean) => querystring.stringify({ query: uriComponent }).substring(6),
  document: { ...global.document },
  name: '',
  particlesJS: () => {},
  pJSDom: [],
  _load_page_timeout: 0,
}

vi.mock('@lingui/core')
vi.mock('@lingui/detect-locale')
vi.mock('@lingui/react')
