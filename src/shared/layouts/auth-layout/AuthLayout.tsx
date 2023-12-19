import { alpha, CardContent, Container, Stack, styled } from '@mui/material'
import { ComponentType, PropsWithChildren } from 'react'
import { DarkModeSwitch } from 'src/shared/dark-mode-switch'
import { LanguageButton } from 'src/shared/language-button'
import { groupChildrenByType } from 'src/shared/utils/groupChildrenByType'
import { AuthHeader } from './AuthHeader'

// typescript only allows string when it defined at `JSX.IntrinsicElements`
export const BrandRegion = 'BrandRegion' as unknown as ComponentType<PropsWithChildren>
export const ContentRegion = 'ContentRegion' as unknown as ComponentType<PropsWithChildren>

const regions = [BrandRegion, ContentRegion]

export type AuthLayoutProps = PropsWithChildren

const AuthCardStyle = styled(Stack)({
  flex: '1 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
})

const AuthWrapper = styled(Container)(({ theme }) => ({
  position: 'fixed',
  overflow: 'auto',
  right: 0,
  top: 0,
  background: theme.palette.common.white,
  height: '100%',
  width: '50%',
  opacity: 0,
  animationDelay: '1s',
  animationDuration: '1s',
  animationFillMode: 'forwards',
  animationName: 'fadeIn',
  animationTimingFunction: 'ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      right: '-50%',
    },
    '100%': {
      opacity: 1,
      right: '0',
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    background: alpha(theme.palette.common.white, 0.8),
  },
}))

export function AuthLayout({ children }: AuthLayoutProps) {
  const map = groupChildrenByType(children, regions)
  const brandChild = map.get(BrandRegion)
  const contentChild = map.get(ContentRegion)

  return (
    <AuthWrapper>
      <Stack position="fixed" top={0} right={0} mr={2} mt={2} flexDirection="row" spacing={1} justifyContent="center" alignItems="center">
        <DarkModeSwitch />
        <LanguageButton />
      </Stack>
      <AuthCardStyle>
        <AuthHeader>{brandChild}</AuthHeader>
        <CardContent>{contentChild}</CardContent>
      </AuthCardStyle>
    </AuthWrapper>
  )
}
