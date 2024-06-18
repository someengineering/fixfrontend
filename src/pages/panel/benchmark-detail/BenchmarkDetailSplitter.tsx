import { Stack, Theme, useMediaQuery } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { useThemeMode } from 'src/core/theme'
import { useNonce } from 'src/shared/providers'
import { GutterTheme, SplitDirection, Splitter } from 'src/shared/splitter'
import { usePersistState } from 'src/shared/utils/usePersistState'

export interface BenchmarkDetailSplitterProps {
  children: ReactNode[]
  isMobile?: boolean
}

const getChildSizes = (children: BenchmarkDetailSplitterProps['children']) => {
  const numberOfValidChildren = children.filter((i) => i).length
  const childSize = 100 / numberOfValidChildren
  return children.map((i) => (i ? childSize : 0))
}

export const BenchmarkDetailDesktopSplitter = ({ children, isMobile }: BenchmarkDetailSplitterProps) => {
  const nonce = useNonce()
  const [sizes, setSizes] = usePersistState<number[] | undefined>('BenchmarkDetailDesktopSplitter.initialSizes', () =>
    getChildSizes(children),
  )
  const { mode } = useThemeMode()

  return (
    <Stack width="100%" height="100%" boxShadow={4}>
      <Splitter
        direction={isMobile ? SplitDirection.Vertical : SplitDirection.Horizontal}
        initialSizes={sizes}
        gutterTheme={mode === 'dark' ? GutterTheme.Dark : GutterTheme.Light}
        onResizeFinished={(_, newSizes) => setSizes(newSizes)}
        classes={children.map(() => 'dbk-child-wrapper')}
        nonce={nonce}
      >
        {children}
      </Splitter>
    </Stack>
  )
}

export const BenchmarkDetailSplitter = ({ children }: BenchmarkDetailSplitterProps) => {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('lg'))
  const memoizedChildren = useMemo(() => {
    const result = children.map((item, index) =>
      item ? (
        <Stack key={index} overflow="auto" width="100%" height="100%" p={1}>
          {item}
        </Stack>
      ) : undefined,
    )
    if (isMobile) {
      result.reverse()
    }
    return result
  }, [children, isMobile])
  return <BenchmarkDetailDesktopSplitter isMobile={isMobile}>{memoizedChildren}</BenchmarkDetailDesktopSplitter>
}
