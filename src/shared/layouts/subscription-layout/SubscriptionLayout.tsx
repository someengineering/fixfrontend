import { alpha, CardContent, Container, Paper, Stack, styled } from '@mui/material'
import { ComponentType, PropsWithChildren } from 'react'
import { DarkModeSwitch } from 'src/shared/dark-mode-switch'
import { LanguageButton } from 'src/shared/language-button'
import { groupChildrenByType } from 'src/shared/utils/groupChildrenByType'
import { SubscriptionHeader } from './SubscriptionHeader'

// typescript only allows string when it defined at `JSX.IntrinsicElements`
export const BrandRegion = 'BrandRegion' as unknown as ComponentType<PropsWithChildren>
export const ContentRegion = 'ContentRegion' as unknown as ComponentType<PropsWithChildren>

const regions = [BrandRegion, ContentRegion]

export type SubscriptionLayoutProps = PropsWithChildren

const SubscriptionCardStyle = styled(Stack)({
  flex: '1 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  overflow: 'auto',
})

const SubscriptionWrapper = styled(Container)(({ theme }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.tooltip + 3,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  opacity: 0,
  animationDelay: '1s',
  animationDuration: '1s',
  animationFillMode: 'forwards',
  animationName: 'fadeIn',
  animationTimingFunction: 'ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

export function SubscriptionLayout({ children }: SubscriptionLayoutProps) {
  const map = groupChildrenByType(children, regions)
  const brandChild = map.get(BrandRegion)
  const contentChild = map.get(ContentRegion)

  return (
    <SubscriptionWrapper sx={{ maxWidth: 'none' }}>
      <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
        <Paper
          elevation={24}
          sx={{
            width: '100%',
            maxHeight: '100%',
            m: { xs: 1, sm: 2, md: 3, lg: 5, xl: 10 },
            bgcolor: ({
              palette: {
                background: { paper },
              },
            }) => alpha(paper, 0.85),
          }}
        >
          <SubscriptionCardStyle>
            <SubscriptionHeader>
              <Stack m={2} flexDirection="row" justifyContent="space-between" alignItems="center">
                {brandChild}
                <Stack flexDirection="row" spacing={1} justifyContent="end" alignItems="center">
                  <DarkModeSwitch />
                  <LanguageButton menuProps={{ sx: { zIndex: ({ zIndex: { tooltip } }) => tooltip + 4 } }} />
                </Stack>
              </Stack>
            </SubscriptionHeader>
            <CardContent>{contentChild}</CardContent>
          </SubscriptionCardStyle>
        </Paper>
      </Stack>
    </SubscriptionWrapper>
  )
}
