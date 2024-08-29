import { Stack, styled } from '@mui/material'
import { ComponentType, PropsWithChildren, useRef } from 'react'
import { groupChildrenByType } from 'src/shared/utils/groupChildrenByType'
import { PanelContent } from './PanelContent'
import { PanelHeader } from './PanelHeader'
import { PageScrollContext } from './usePageScroll'

// typescript only allows string when it defined at `JSX.IntrinsicElements`
export const LogoRegion = 'LogoRegion' as unknown as ComponentType<PropsWithChildren>
export const ContentRegion = 'ContentRegion' as unknown as ComponentType<PropsWithChildren>
export const BottomRegion = 'BottomRegion' as unknown as ComponentType<PropsWithChildren>

const regions = [LogoRegion, ContentRegion, BottomRegion]

export type PanelLayoutProps = PropsWithChildren

const Main = styled(Stack)(({ theme }) => ({
  background: theme.palette.common.white,
  flexGrow: 1,
  overflow: 'hidden',
  height: '100vh',
  width: '100%',
}))

export function PanelLayout({ children }: PanelLayoutProps) {
  const mainRef = useRef<HTMLDivElement>(null)
  const map = groupChildrenByType(children, regions)
  const logoChild = map.get(LogoRegion)
  const contentChild = map.get(ContentRegion)
  // const bottomChild = map.get(BottomRegion)

  return (
    <PageScrollContext.Provider value={mainRef}>
      <Main>
        <PanelHeader scrollRef={mainRef}>{logoChild}</PanelHeader>
        <PanelContent
          ref={mainRef}
          // bottom={bottomChild}
        >
          {contentChild}
        </PanelContent>
      </Main>
    </PageScrollContext.Provider>
  )
}
