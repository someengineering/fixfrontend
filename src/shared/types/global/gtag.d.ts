// TODO: remove this after posthog added
declare global {
  interface Window {
    gtag: (name: 'event' | 'config', event: string, params: unknown) => void
  }
}

export {}
