import { StoryContext, StrictArgs } from '@storybook/react'
import { FC, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useThemeMode } from 'src/core/theme'
import { AbsoluteNavigateContext } from 'src/shared/absolute-navigate'
import { i18n } from 'src/shared/providers'

export const InnerBasicProviders = ({ Story, context }: { Story: FC<StrictArgs>; context: StoryContext }) => {
  const { theme: themeKey, lang } = context.globals as { theme: 'light' | 'dark'; lang: string }
  const { toggleColorMode } = useThemeMode()

  useEffect(() => {
    i18n.activate(lang)
  }, [lang])

  useEffect(() => {
    toggleColorMode(themeKey)
  }, [toggleColorMode, themeKey])

  return (
    <BrowserRouter>
      <AbsoluteNavigateContext.Provider value={() => {}}>
        <Story {...context.args} />
      </AbsoluteNavigateContext.Provider>
    </BrowserRouter>
  )
}
