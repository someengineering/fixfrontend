module.exports = {
  locales: ['en_US', 'de_DE'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  compileNamespace: 'ts',
  format: 'po',
}
