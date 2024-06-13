import Splitter, { GutterTheme, SplitDirection } from '@devbookhq/splitter'
import { Stack, Theme, useMediaQuery } from '@mui/material'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useThemeMode } from 'src/core/theme'

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
  const [sizes, setSizes] = useState<number[] | undefined>(() => getChildSizes(children))
  useEffect(() => {
    setSizes(() => getChildSizes(children))
  }, [children])
  const { mode } = useThemeMode()

  return (
    <Stack
      width="100%"
      height="100%"
      boxShadow={4}
      sx={sizes ? { '& .dbk-child-wrapper': { width: 0, transition: ({ transitions }) => transitions.create('width') } } : undefined}
    >
      <Splitter
        direction={isMobile ? SplitDirection.Vertical : SplitDirection.Horizontal}
        initialSizes={sizes ?? []}
        gutterTheme={mode === 'dark' ? GutterTheme.Dark : GutterTheme.Light}
        onResizeStarted={() => setSizes(undefined)}
        onResizeFinished={(_, newSizes) => setSizes(newSizes)}
        classes={children.map(() => 'dbk-child-wrapper')}
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
