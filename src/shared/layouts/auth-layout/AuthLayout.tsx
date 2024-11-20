import { alpha, buttonClasses, Container, Stack, styled, useMediaQuery } from '@mui/material'
import { ComponentType, PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'
import { DescriptionIcon } from 'src/assets/icons'
import { env, panelUI } from 'src/shared/constants'
import { ExternalLinkButton } from 'src/shared/link-button'
import { groupChildrenByType } from 'src/shared/utils/groupChildrenByType'

// typescript only allows string when it defined at `JSX.IntrinsicElements`
export const BrandRegion = 'BrandRegion' as unknown as ComponentType<PropsWithChildren>
export const SideRegion = 'SideRegion' as unknown as ComponentType<PropsWithChildren>
export const ContentRegion = 'ContentRegion' as unknown as ComponentType<PropsWithChildren>
export const FooterRegion = 'FooterRegion' as unknown as ComponentType<PropsWithChildren>

const regions = [BrandRegion, SideRegion, ContentRegion, FooterRegion]

export type AuthLayoutProps = PropsWithChildren

const AuthDescWrapper = styled(Stack)({
  position: 'fixed',
  right: 0,
  top: 0,
  marginRight: 0,
  marginLeft: 'auto',
  opacity: 0,
  height: '100%',
  width: '50%',
  justifyContent: 'center',
  background: panelUI.uiThemePalette.accent.darkGray,
  animationDelay: '1s',
  animationDuration: '1s',
  animationFillMode: 'forwards',
  animationName: 'fadeIn',
  animationTimingFunction: 'ease-in-out',
  alignItems: 'center',
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
})

const AuthWrapper = styled(Container)(({ theme }) => ({
  position: 'fixed',
  overflow: 'auto',
  left: 0,
  top: 0,
  marginLeft: 0,
  marginRight: 'auto',
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
      left: '-50%',
    },
    '100%': {
      opacity: 1,
      left: 0,
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

export function AuthLayout({ children }: AuthLayoutProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))
  const { pathname } = useLocation()
  const isResetPassword = pathname === '/auth/forgot-password' || pathname === '/auth/reset-password'
  const map = groupChildrenByType(children, regions)
  const brandChild = map.get(BrandRegion)
  const contentChild = map.get(ContentRegion)
  const footerChild = map.get(FooterRegion)
  const sideChild = map.get(SideRegion)

  const documentation = isResetPassword ? null : (
    <ExternalLinkButton
      href={env.docsUrl}
      endIcon={undefined}
      startIcon={<DescriptionIcon />}
      variant="outlined"
      sx={
        isMobile
          ? undefined
          : {
              color: panelUI.uiThemePalette.primary.white,
              borderColor: alpha(panelUI.uiThemePalette.primary.white, 0.25),
              bgcolor: alpha(panelUI.uiThemePalette.primary.white, 0.15),
              ':hover,:focus,:active': {
                bgcolor: alpha(panelUI.uiThemePalette.primary.white, 0.2),
                borderColor: alpha(panelUI.uiThemePalette.primary.white, 0.5),
              },
              [`.${buttonClasses.icon} svg`]: {
                fill: panelUI.uiThemePalette.primary.white,
              },
            }
      }
      size="small"
    >
      Documentation
    </ExternalLinkButton>
  )

  return (
    <>
      <AuthWrapper sx={isResetPassword ? { width: '100%' } : undefined}>
        <Stack flex="1 0 auto" minHeight="100%">
          <Stack p={3.75} direction="row" justifyContent="space-between">
            {brandChild}
            {isMobile && !isResetPassword ? documentation : null}
          </Stack>
          <Stack maxWidth="100%" width={472} mt={3.75} flexGrow={1} justifyContent="center" alignSelf="center">
            {contentChild}
            {isResetPassword ? null : (
              <Stack mt={2} mb={2} flexGrow={{ xs: 1, sm: 0 }}>
                {footerChild}
              </Stack>
            )}
          </Stack>
        </Stack>
      </AuthWrapper>
      {!isMobile && !isResetPassword ? (
        <AuthDescWrapper>
          <Stack
            position="fixed"
            top={0}
            right={0}
            mr={3.75}
            mt={4.5}
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            overflow="auto"
          >
            {documentation}
          </Stack>
          {sideChild}
        </AuthDescWrapper>
      ) : undefined}
    </>
  )
}
