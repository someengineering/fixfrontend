import { alpha, CardContent, Container, Stack, styled, Theme, useMediaQuery } from '@mui/material'
import { ComponentType, PropsWithChildren } from 'react'
import { DarkModeSwitch } from 'src/shared/dark-mode-switch'
import { LanguageButton } from 'src/shared/language-button'
import { groupChildrenByType } from 'src/shared/utils/groupChildrenByType'
import { AuthHeader } from './AuthHeader'

// typescript only allows string when it defined at `JSX.IntrinsicElements`
export const BrandRegion = 'BrandRegion' as unknown as ComponentType<PropsWithChildren>
export const LeftRegion = 'LeftRegion' as unknown as ComponentType<PropsWithChildren>
export const ContentRegion = 'ContentRegion' as unknown as ComponentType<PropsWithChildren>
export const FooterRegion = 'FooterRegion' as unknown as ComponentType<PropsWithChildren>

const regions = [BrandRegion, LeftRegion, ContentRegion, FooterRegion]

export type AuthLayoutProps = PropsWithChildren

const AuthCardStyle = styled(Stack)({
  flex: '1 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: '100%',
})

const AuthDescWrapper = styled(Stack)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  opacity: 0,
  height: '100%',
  width: '50%',
  justifyContent: 'center',
  background: theme.palette.mode === 'light' ? '#eef7ff' : '#132e69',
  animationDelay: '1s',
  animationDuration: '1s',
  animationFillMode: 'forwards',
  animationName: 'fadeIn',
  animationTimingFunction: 'ease-in-out',
  alignItems: 'center',
  '& > *': {
    width: '80%',
    maxWidth: 600,
    position: 'relative',
    opacity: 0,
    animationDelay: '1s',
    animationDuration: '1s',
    animationFillMode: 'forwards',
    animationName: 'fadeInTop',
    animationTimingFunction: 'ease-in-out',
    background: `${alpha(theme.palette.background.default, 0.9)} !important`,
  },
  '@keyframes fadeInTop': {
    '0%': {
      opacity: 0,
      top: '-50%',
    },
    '100%': {
      opacity: 1,
      top: 0,
    },
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      left: '-50%',
    },
    '100%': {
      opacity: 1,
      left: 0,
    },
  },
}))

const AuthWrapper = styled(Container)(({ theme }) => ({
  position: 'fixed',
  overflow: 'auto',
  right: 0,
  top: 0,
  background: theme.palette.common.white,
  height: '100%',
  width: '50%',
  maxWidth: '100% !important',
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
      right: 0,
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    background: alpha(theme.palette.common.white, 0.8),
  },
}))

export function AuthLayout({ children }: AuthLayoutProps) {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  const map = groupChildrenByType(children, regions)
  const brandChild = map.get(BrandRegion)
  const contentChild = map.get(ContentRegion)
  const footerChild = map.get(FooterRegion)
  const leftChild = map.get(LeftRegion)

  return (
    <>
      {!isMobile ? <AuthDescWrapper spacing={4}>{leftChild}</AuthDescWrapper> : undefined}
      <AuthWrapper>
        <Stack position="fixed" top={0} right={0} mr={2} mt={2} direction="row" spacing={1} justifyContent="center" alignItems="center">
          <DarkModeSwitch />
          <LanguageButton />
        </Stack>
        <AuthCardStyle>
          <Stack flexGrow={1} justifyContent="center">
            <AuthHeader>{brandChild}</AuthHeader>
            <Stack spacing={2}>{isMobile ? leftChild : undefined}</Stack>
            <CardContent>{contentChild}</CardContent>
          </Stack>
          <Stack p={2} mb={2}>
            {footerChild}
          </Stack>
        </AuthCardStyle>
      </AuthWrapper>
    </>
  )
}
