module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['prettier', '@typescript-eslint', 'react-refresh'],
  overrides: [
    {
      files: ['*.js'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
    },
    {
      files: ['lingui.config.ts', 'src/locales/*/messages.d.ts', '.storybook/*.ts', 'mock/**/*.ts'],
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    {
      files: ['vite.config.ts'],
      parserOptions: {
        project: './tsconfig.node.json',
      },
    },
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': ['warn'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mui/*', '!@mui/material', '!@mui/lab', '!@mui/x-tree-view', '!@mui/icons-material', '!@mui/icons-material/*'],
            message: 'Only import usage of @mui/material and @mui/lab and @mui/x-tree-view is allowed.',
          },
          {
            group: ['../**'],
            message: 'Relative import is not allowed.',
          },
          {
            group: ['src/*/*/**', '!src/pages/panel/shared-queries', '!src/shared/utils/*', '!src/shared/types/*', '!src/shared/layouts/*'],
            message:
              'Every components in shared should have index.ts for re-export and import from top folder of shared is only allowed with the exception of layouts/parent, types/parent, utils/util',
          },
        ],
        paths: [
          {
            name: '.',
            message: 'Why?! :| don\'t do this',
          },
        ],
      },
    ],
  },
}
