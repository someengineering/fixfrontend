declare global {
  interface Window {
    gtag: (name: 'event', event: string, params: unknown) => void
  }
}

export {}
