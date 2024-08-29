// import { AppBar, Theme, Toolbar, useMediaQuery } from '@mui/material'
import { AppBar, ButtonBase, Divider, Slide, Stack, Theme, useMediaQuery, useScrollTrigger } from '@mui/material'
import { cloneElement, PropsWithChildren, ReactElement, RefObject } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { MainMenu } from './MainMenu'
import { PanelBreadcrumbs } from './PanelBreadcrumbs'
import { PanelToolbar } from './PanelToolbar'
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
      <AppBar position={isDesktop ? 'static' : 'fixed'} elevation={0}>
        <PanelToolbar>
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
          {isDesktop ? (
            <Stack direction="row" spacing={1} height="100%" alignItems="center">
              <MainMenu />
              <Divider orientation="vertical" sx={{ m: 1, height: 24 }} />
              <Stack direction="row" spacing={1.5} height="100%" alignItems="center">
                <Stack direction="row" height="100%" alignItems="center">
                  question settings
                </Stack>
                user
              </Stack>
            </Stack>
          ) : (
            <Stack direction="row" spacing={0.5} height="100%" alignItems="center">
              question mobile-menu
            </Stack>
          )}
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
