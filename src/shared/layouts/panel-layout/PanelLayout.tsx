import { Box, styled } from '@mui/material'
import { ComponentType, PropsWithChildren } from 'react'
import { groupChildrenByType } from 'src/shared/utils/groupChildrenByType'
import { PanelContent } from './PanelContent'
import { PanelHeader } from './PanelHeader'

// typescript only allows string when it defined at `JSX.IntrinsicElements`
export const LogoRegion = 'LogoRegion' as unknown as ComponentType<PropsWithChildren>
export const ContentRegion = 'ContentRegion' as unknown as ComponentType<PropsWithChildren>
export const BottomRegion = 'BottomRegion' as unknown as ComponentType<PropsWithChildren>

const regions = [LogoRegion, ContentRegion, BottomRegion]

export type PanelLayoutProps = PropsWithChildren

const Main = styled(Box)(({ theme }) => ({
  background: theme.palette.common.white,
  display: 'flex',
  flexGrow: 1,
  height: '100%',
  width: '100%',
}))

export function PanelLayout({ children }: PanelLayoutProps) {
  const map = groupChildrenByType(children, regions)
  const logoChild = map.get(LogoRegion)
  const contentChild = map.get(ContentRegion)
  // const bottomChild = map.get(BottomRegion)

  return (
    <Main>
      <PanelHeader>{logoChild}</PanelHeader>
      <PanelContent
      // bottom={bottomChild}
      >
        {contentChild}
      </PanelContent>
    </Main>
  )
}
