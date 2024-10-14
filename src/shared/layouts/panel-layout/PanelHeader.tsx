// import { AppBar, Theme, Toolbar, useMediaQuery } from '@mui/material'
import { Trans } from '@lingui/macro'
import { AppBar, Box, ButtonBase, Divider, IconButton, Slide, Stack, Theme, Tooltip, useMediaQuery, useScrollTrigger } from '@mui/material'
import { cloneElement, PropsWithChildren, ReactElement, RefObject } from 'react'
import { CalendarMonthIcon, DiscordIcon, GithubSEBIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { env, panelUI } from 'src/shared/constants'
import { ExternalLinkButton } from 'src/shared/link-button'
import { MainMenu } from './MainMenu'
import { PanelBreadcrumbs } from './PanelBreadcrumbs'
import { PanelHeaderLinkButton } from './PanelHeaderButton'
import { PanelToolbar } from './PanelToolbar'
import { UserButton } from './UserButton'
import { WorkspacesButton } from './WorkspacesButton'
// import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'

interface PanelHeaderProps extends PropsWithChildren {
  scrollRef: RefObject<HTMLElement | null>
}

interface PanelHeaderWrapperProps {
  children: ReactElement
  scrollRef: RefObject<HTMLElement | null>
}

const ElevationScroll = ({ children, scrollRef }: PanelHeaderWrapperProps) =>
  cloneElement(children, {
    elevation: useScrollTrigger({ disableHysteresis: true, threshold: 0, target: scrollRef.current || window }) ? 4 : 0,
  })

const HideOnScroll = ({ children, scrollRef }: PanelHeaderWrapperProps) => (
  <Slide appear={false} direction="down" in={!useScrollTrigger({ target: scrollRef.current || window })}>
    {children}
  </Slide>
)

export const PanelHeader = ({ children, scrollRef }: PanelHeaderProps) => {
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'))
  const navigate = useAbsoluteNavigate()
  const ComponentToWrap = isDesktop ? ElevationScroll : HideOnScroll
  return (
    <ComponentToWrap scrollRef={scrollRef}>
      <AppBar position={isDesktop ? 'static' : 'fixed'} elevation={0} sx={{ overflow: 'auto' }}>
        <PanelToolbar sx={{ minWidth: 1200 }}>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <ButtonBase
              href={panelUI.homePage}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(panelUI.homePage)
              }}
            >
              {children}
            </ButtonBase>
            <Divider orientation="vertical" sx={{ m: 1, height: 24 }} />
            <WorkspacesButton />
          </Stack>
          {/* {isDesktop ? ( */}
          <>
            <MainMenu />
            <Stack direction="row" spacing={1.5} height="100%" alignItems="center">
              <Tooltip title={<Trans>Get a 1-on-1 cloud security posture assessment</Trans>}>
                <Box>
                  <ExternalLinkButton href={env.bookACallUrl} variant="outlined" startIcon={<CalendarMonthIcon />} color="info" noEndIcon>
                    <Trans>Book a call</Trans>
                  </ExternalLinkButton>
                </Box>
              </Tooltip>
              <Stack direction="row" height="100%" alignItems="center">
                <PanelHeaderLinkButton size="small" component={IconButton} href={env.discordUrl} color="info" noEndIcon>
                  <DiscordIcon width={24} height={20} />
                </PanelHeaderLinkButton>
                <PanelHeaderLinkButton size="small" component={IconButton} href={env.githubUrl} color="info" noEndIcon>
                  <GithubSEBIcon width={18} height={18} />
                </PanelHeaderLinkButton>
              </Stack>
              <UserButton />
            </Stack>
          </>
          {/* ) : null} */}
        </PanelToolbar>
        {isDesktop ? <PanelBreadcrumbs /> : null}
      </AppBar>
    </ComponentToWrap>
  )
  // const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'))
  // const navigate = useAbsoluteNavigate()
  // const Content = (
  //   <AppBar position="fixed">
  //     <Toolbar>
  //       <MenuIconButton
  //         color="inherit"
  //         aria-label={t`Open drawer`}
  //         onClick={isDesktop ? onDrawerOpen : onDrawerToggle}
  //         edge="start"
  //         open={open}
  //         isDesktop={isDesktop}
  //       >
  //         <MenuIcon />
  //       </MenuIconButton>
  //       {!open || !isDesktop ? (
  //         <AppBarLogo>
  //           <ButtonBase
  //             href={panelUI.homePage}
  //             onClick={(e) => {
  //               e.preventDefault()
  //               e.stopPropagation()
  //               navigate(panelUI.homePage)
  //             }}
  //           >
  //             {children}
  //           </ButtonBase>
  //         </AppBarLogo>
  //       ) : null}
  //       <AppBarActions>
  //         {/* <DarkModeSwitch whiteMode /> */}
  //         <EventButton />
  //         <LanguageButton whiteMode />
  //         <UserProfileButton />
  //       </AppBarActions>
  //     </Toolbar>
  //   </AppBar>
  // )
  // return isDesktop ? Content : <HideOnScroll>{Content}</HideOnScroll>
}
