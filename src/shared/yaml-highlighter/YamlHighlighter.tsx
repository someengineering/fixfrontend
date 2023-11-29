import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import yaml from 'highlight.js/lib/languages/yaml'
import highlightGithubDark from 'highlight.js/styles/atom-one-dark-reasonable.css?inline'
import highlightGithub from 'highlight.js/styles/atom-one-light.css?inline'
import { createLowlight } from 'lowlight'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { useThemeMode } from 'src/core/theme'

const lowlight = createLowlight({ yaml })

export const YamlHighlighter = ({ children }: { children: string }) => {
  const { mode } = useThemeMode()
  const tree = lowlight.highlight('yaml', children)
  return (
    <>
      <style>{mode === 'dark' ? highlightGithubDark : highlightGithub}</style>
      {toJsxRuntime(tree, { Fragment, jsx, jsxs })}
    </>
  )
}
