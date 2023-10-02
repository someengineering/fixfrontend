import { alpha, styled } from '@mui/material'
import { forwardRef, memo, useEffect, useRef } from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { LoadingStateType } from './FullPageLoadingProvider'
import { Spinner } from './Spinner'

interface FullPageLoadingProps {
  loadingState: LoadingStateType
}

type FullPageLoadingContentProps = FullPageLoadingProps & { transitionState: TransitionStatus; backgroundState: TransitionStatus }

const FullPageLoadingContainer = styled('div', { shouldForwardProp })<Partial<FullPageLoadingContentProps>>(
  ({ loadingState, transitionState, theme }) => ({
    position: 'fixed',
    display: transitionState !== 'exited' ? 'flex' : 'none',
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    top: 0,
    height: '100%',
    width: loadingState === LoadingStateType.HALF_WIDTH ? '50%' : '100%',
    opacity: transitionState === 'entering' || transitionState === 'entered' ? 1 : 0,
    textAlign: 'center',
    transition: 'width 1s ease-in-out 1s, opacity .2s ease-in-out',
    zIndex: loadingState === LoadingStateType.HALF_WIDTH ? 0 : theme.zIndex.tooltip + 2,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  }),
)

const VerticalCenteredBox = styled(FullPageLoadingContainer, { shouldForwardProp })<Partial<FullPageLoadingContentProps>>(
  ({ loadingState, backgroundState, transitionState, theme }) => ({
    position: 'absolute',
    display: transitionState !== 'exited' || backgroundState !== 'exited' ? 'block' : 'none',
    width: '100%',
    height: '100%',
    opacity:
      (backgroundState !== 'entering' && backgroundState !== 'entered') || (transitionState !== 'entering' && transitionState !== 'entered')
        ? 0
        : 1,
    zIndex: loadingState === LoadingStateType.HALF_WIDTH ? 0 : theme.zIndex.tooltip + 1,
    transition: 'opacity .2s ease-in-out',
    overflow: 'hidden',
  }),
)

const FullPageLoadingContent = forwardRef<HTMLDivElement, FullPageLoadingContentProps>(
  ({ loadingState, transitionState, backgroundState }, ref) => {
    const needsRepaint = useRef(loadingState === LoadingStateType.SHOW || loadingState === LoadingStateType.HALF_WIDTH)
    useEffect(() => {
      try {
        if (needsRepaint.current && loadingState !== LoadingStateType.HIDE && loadingState !== LoadingStateType.SHOW_NO_BACKGROUND) {
          window.particlesJS('particles', {
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
          })
        }
        needsRepaint.current = loadingState === LoadingStateType.HIDE || loadingState === LoadingStateType.SHOW_NO_BACKGROUND
      } catch {
        needsRepaint.current = true
      }
    }, [loadingState])
    return (
      <>
        {backgroundState !== 'exited' && transitionState !== 'exited' ? (
          <VerticalCenteredBox
            id="particles"
            className="particles"
            backgroundState={backgroundState}
            transitionState={transitionState}
            loadingState={loadingState}
          />
        ) : null}
        <FullPageLoadingContainer ref={ref} loadingState={loadingState} transitionState={transitionState}>
          <Spinner isDark={loadingState !== LoadingStateType.SHOW_NO_BACKGROUND} isLoading={loadingState !== LoadingStateType.HALF_WIDTH} />
        </FullPageLoadingContainer>
      </>
    )
  },
)

export const FullPageLoading = memo(
  ({ loadingState }: FullPageLoadingProps) => {
    const nodeRef = useRef<HTMLDivElement>(null)
    return (
      <Transition nodeRef={nodeRef} in={loadingState !== LoadingStateType.HIDE} timeout={200}>
        {(state) => (
          <Transition nodeRef={nodeRef} in={loadingState !== LoadingStateType.SHOW_NO_BACKGROUND} timeout={200}>
            {(backgroundState) => (
              <FullPageLoadingContent loadingState={loadingState} transitionState={state} backgroundState={backgroundState} ref={nodeRef} />
            )}
          </Transition>
        )}
      </Transition>
    )
  },
  (prev, next) => prev.loadingState === next.loadingState,
)
