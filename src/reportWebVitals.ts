import { Metric, ReportOpts } from 'web-vitals'

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void, opts?: ReportOpts | undefined) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry, opts)
      onINP(onPerfEntry, opts)
      onFCP(onPerfEntry, opts)
      onLCP(onPerfEntry, opts)
      onTTFB(onPerfEntry, opts)
    })
  }
}

export default reportWebVitals
