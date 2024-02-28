import { LicenseInfo } from '@mui/x-license-pro'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import { env } from './shared/constants'

if (env.muiLicenseKey) {
  LicenseInfo.setLicenseKey(env.muiLicenseKey)
}

const root = ReactDOM.createRoot(window.document.getElementById('root') as HTMLElement)
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
