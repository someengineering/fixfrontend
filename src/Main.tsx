import { LicenseInfo } from '@mui/x-license'
import { HTMLAttributes, MetaHTMLAttributes } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { env } from './shared/constants'

if (env.muiLicenseKey) {
  LicenseInfo.setLicenseKey(env.muiLicenseKey)
}
let nonceEl = window?.document?.head?.querySelector?.('meta[property="csp-nonce"]') as unknown as { remove: () => void } | undefined
let nonce = (nonceEl as MetaHTMLAttributes<HTMLAttributes<HTMLElement>>)?.content

if (nonceEl) {
  nonceEl.remove()
  nonceEl = undefined
}

if (window._load_page_timeout) {
  try {
    window.clearTimeout(window._load_page_timeout)
  } catch {
    /* empty */
  }
  delete window._load_page_timeout
}

const root = ReactDOM.createRoot(window.document.getElementById('root') as HTMLElement)
root.render(<App nonce={nonce} />)

nonce = undefined

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (env.isLocal) {
  import(
    /* webpackChunkName: "reportWebVitals" */
    './reportWebVitals'
  ).then((reportWebVitals) => {
    reportWebVitals.default(console.info)
  })
}
