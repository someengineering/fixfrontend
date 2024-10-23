import { Stack } from '@mui/material'
import { ComponentType, PropsWithChildren } from 'react'
import { groupChildrenByType } from 'src/shared/utils/groupChildrenByType'
import { ButtonsRegionProvider } from './ButtonsRegion'
import { PanelSettingsContent } from './PanelSettingsContent'

// typescript only allows string when it defined at `JSX.IntrinsicElements`
export const ContentRegion = 'ContentRegion' as unknown as ComponentType<PropsWithChildren>

const regions = [ContentRegion]

export const PanelSettingsLayout = ({ children }: PropsWithChildren) => {
  const map = groupChildrenByType(children, regions)
  const contentChild = map.get(ContentRegion)

  return (
    <Stack
      direction="row"
      m={-3}
      height={({ spacing }) => `calc(100% + ${spacing(6)})`}
      width={({ spacing }) => `calc(100% + ${spacing(6)})`}
      flex={1}
      overflow="hidden"
    >
      <ButtonsRegionProvider>
        <PanelSettingsContent>{contentChild}</PanelSettingsContent>
      </ButtonsRegionProvider>
    </Stack>
  )
}
