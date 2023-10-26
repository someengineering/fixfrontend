import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
  locales: ['en_US', 'de_DE'],
  sourceLocale: 'en_US',
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
