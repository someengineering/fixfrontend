import { styled } from '@mui/material'
import { forwardRef, memo, useEffect, useRef } from 'react'
import { useMatch } from 'react-router-dom'
import { Transition, TransitionStatus } from 'react-transition-group'
import { useNonce } from 'src/shared/providers'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { LoadingStateType } from './LoadingContext'
import { Spinner } from './Spinner'

interface FullPageLoadingProps {
  loadingState: LoadingStateType
}

type FullPageLoadingContentProps = FullPageLoadingProps & {
  transitionState: TransitionStatus
  backgroundState: TransitionStatus
  isHalfWidth: boolean
}

const FullPageLoadingContainer = styled('div', { shouldForwardProp })<Partial<FullPageLoadingContentProps>>(
  ({ isHalfWidth, transitionState, theme }) => ({
    position: 'fixed',
    display: transitionState !== 'exited' ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    top: 0,
    height: '100%',
    width: isHalfWidth ? '50%' : '100%',
    opacity: transitionState === 'entering' || transitionState === 'entered' ? 1 : 0,
    textAlign: 'center',
    transition: `${theme.transitions.create('width', { duration: theme.transitions.duration.longer })}, ${theme.transitions.create(
      'opacity',
      { duration: theme.transitions.duration.shorter },
    )}`,
    zIndex: isHalfWidth ? 0 : theme.zIndex.tooltip + 2,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  }),
)

const VerticalCenteredBox = styled(FullPageLoadingContainer, { shouldForwardProp })<Partial<FullPageLoadingContentProps>>(
  ({ isHalfWidth, backgroundState, transitionState, theme }) => ({
    position: 'absolute',
    display: transitionState !== 'exited' || backgroundState !== 'exited' ? 'block' : 'none',
    width: '100%',
    height: '100%',
    opacity:
      (backgroundState !== 'entering' && backgroundState !== 'entered') || (transitionState !== 'entering' && transitionState !== 'entered')
        ? 0
        : 1,
    zIndex: isHalfWidth ? 0 : theme.zIndex.tooltip + 1,
    transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.shorter }),
    overflow: 'hidden',
  }),
)

const FullPageLoadingContent = forwardRef<HTMLDivElement, FullPageLoadingContentProps>(
  ({ isHalfWidth, loadingState, transitionState, backgroundState }, ref) => {
    const nonce = useNonce()
    const firstTimeLoad = useRef(loadingState === LoadingStateType.SHOW || isHalfWidth)
    useEffect(() => {
      try {
        if (backgroundState === 'entering' || transitionState === 'entering' || firstTimeLoad.current) {
          if (firstTimeLoad.current && window.pJSDom && window.pJSDom.length > 0) {
            window.pJSDom.forEach(({ pJS: { fn } }) => {
              fn.canvasClear()
              fn.particlesEmpty()
            })
            window.pJSDom[0].pJS.fn.vendors.destroypJS()
            window.pJSDom = []
          }
          if (window.pJSDom && !window.pJSDom.length) {
            window.particlesJS(
              'particles',
              {
                particles: {
                  number: {
                    value: 350,
                    density: { enable: true, value_area: 1920 },
                  },
                  color: { value: '#ffffff' },
                  opacity: { value: 1 },
                  size: { value: 1, random: true },
                  line_linked: { enable: true, distance: 100, color: '#ffffff', opacity: 0.5, width: 1 },
                  move: {
                    enable: true,
                    speed: 0.5,
                    direction: 'left',
                    random: true,
                    out_mode: 'out',
                  },
                },
                interactivity: {
                  detect_on: 'window',
                  events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
                  modes: {
                    grab: { distance: 210, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 1 },
                  },
                },
              },
              nonce,
            )
          }
        } else if (backgroundState === 'exited' || transitionState === 'exited') {
          if (window.pJSDom && window.pJSDom.length > 0) {
            window.pJSDom.forEach(({ pJS: { fn } }) => {
              fn.canvasClear()
              fn.particlesEmpty()
            })
            window.pJSDom[0].pJS.fn.vendors.destroypJS()
            window.pJSDom = []
          }
        }
      } catch (err) {
        console.error(err)
      }
      firstTimeLoad.current = false
    }, [loadingState, backgroundState, transitionState, nonce])
    return (
      <>
        {backgroundState !== 'exited' && transitionState !== 'exited' ? (
          <VerticalCenteredBox
            id="particles"
            className="particles"
            backgroundState={backgroundState}
            transitionState={transitionState}
            loadingState={loadingState}
            isHalfWidth={isHalfWidth}
          />
        ) : null}
        <FullPageLoadingContainer ref={ref} loadingState={loadingState} transitionState={transitionState} isHalfWidth={isHalfWidth}>
          <Spinner isLoading={!loadingState} />
        </FullPageLoadingContainer>
      </>
    )
  },
)

export const FullPageLoading = memo(
  ({ loadingState }: FullPageLoadingProps) => {
    const nodeRef = useRef<HTMLDivElement>(null)
    const authMatch = useMatch('/auth/*')
    const subscriptionMatch = useMatch('/subscription/*')
    const isHalfWidth = Boolean(authMatch && loadingState === LoadingStateType.HIDE)
    const loadingStateWithSub = !!subscriptionMatch
    return (
      <Transition nodeRef={nodeRef} in={loadingState !== LoadingStateType.HIDE || isHalfWidth || loadingStateWithSub} timeout={200}>
        {(state) => (
          <Transition nodeRef={nodeRef} in={loadingState !== LoadingStateType.SHOW_NO_BACKGROUND} timeout={200}>
            {(backgroundState) => (
              <FullPageLoadingContent
                loadingState={loadingState}
                transitionState={state}
                backgroundState={backgroundState}
                ref={nodeRef}
                isHalfWidth={isHalfWidth}
              />
            )}
          </Transition>
        )}
      </Transition>
    )
  },
  (prev, next) => prev.loadingState === next.loadingState,
)
