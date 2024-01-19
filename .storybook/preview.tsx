import type { Preview } from '@storybook/react'
import { langs } from 'src/shared/constants'
import { WithProviders } from './WithProviders'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      title: 'Theme',
      description: 'Dark or light mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'light', left: '☀️', title: 'Light mode' },
          { value: 'dark', left: '🌙', title: 'Dark mode' },
        ],
      },
    },
    lang: {
      name: 'Language',
      title: 'Language',
      defaultValue: 'en-US',
      description: 'Change language',
      toolbar: {
        icon: 'globe',
        dynamicTitle: true,
        items: Object.values(langs).map(({ Icon, title, locale }) => ({ value: locale, left: Icon, title })),
      },
    },
  },
  decorators: [(Story, context) => <WithProviders Story={Story} context={context} />],
}

export default preview
