import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import yaml from 'highlight.js/lib/languages/yaml'
import highlightGithubDark from 'highlight.js/styles/atom-one-dark-reasonable.css?inline'
import highlightGithub from 'highlight.js/styles/atom-one-light.css?inline'
import { createLowlight } from 'lowlight'
import { ReactElement } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { useThemeMode } from 'src/core/theme'
import { useNonce } from 'src/shared/providers'

const lowlight = createLowlight({ yaml })

interface YamlHighlighterProps {
  children: string
}

export const YamlHighlighter = ({ children }: YamlHighlighterProps) => {
  const nonce = useNonce()
  const { mode } = useThemeMode()
  const tree = lowlight.highlight('yaml', children)
  return (
    <>
      <style nonce={nonce}>{mode === 'dark' ? highlightGithubDark : highlightGithub}</style>
      {toJsxRuntime(tree, {
        Fragment,
        jsx: jsx as (type: unknown, props: unknown) => ReactElement<unknown, string | React.JSXElementConstructor<unknown>>,
        jsxs: jsxs as (type: unknown, props: unknown) => ReactElement<unknown, string | React.JSXElementConstructor<unknown>>,
      })}
    </>
  )
}
