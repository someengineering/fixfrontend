import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
  locales: ['en-US', 'de-DE'],
  sourceLocale: 'en-US',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  compileNamespace: 'ts',
  format: 'po',
}

export default config
