import { styled } from '@mui/material'
import { forwardRef, useEffect, useRef } from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { LoadingStateType } from './FullPageLoadingProvider'
import { Spinner } from './Spinner'

interface FullPageLoadingProps {
  loadingState: LoadingStateType
}

type FullPageLoadingContentProps = FullPageLoadingProps & { transitionState: TransitionStatus }

const FullPageLoadingContainer = styled('div', { shouldForwardProp })<Partial<FullPageLoadingContentProps>>(
  ({ loadingState, transitionState, theme }) => ({
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    top: 0,
    width: loadingState === LoadingStateType.HALF_WIDTH ? '50%' : '100%',
    opacity: transitionState === 'entering' || transitionState === 'entered' ? 1 : 0,
    height: '100%',
    textAlign: 'center',
    transition: 'width 1s ease-in-out 1s, opacity .2s ease-in-out',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  }),
)

const VerticalCenteredBox = styled(FullPageLoadingContainer)({
  position: 'absolute',
  width: '100%',
  opacity: 1,
  transition: 'none',
})

const FullPageLoadingContent = forwardRef<HTMLDivElement, FullPageLoadingContentProps>(({ loadingState, transitionState }, ref) => {
  useEffect(() => {
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
  }, [])
  return (
    <>
      <VerticalCenteredBox id="particles" className="particles" />
      <FullPageLoadingContainer ref={ref} loadingState={loadingState} transitionState={transitionState}>
        <Spinner isDark isLoading={loadingState !== LoadingStateType.HALF_WIDTH} />
      </FullPageLoadingContainer>
    </>
  )
})

export const FullPageLoading = ({ loadingState }: FullPageLoadingProps) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  return (
    <Transition nodeRef={nodeRef} in={loadingState !== LoadingStateType.HIDE} timeout={200}>
      {(state) => <FullPageLoadingContent loadingState={loadingState} transitionState={state} ref={nodeRef} />}
    </Transition>
    // <>
    //   <VerticalCenteredBox id="particles" className="particles" loadingState={loadingState} />
    //   <VerticalCenteredBox loadingState={loadingState}>
    //     <Spinner isDark />
    //   </VerticalCenteredBox>
    // </>
  )
}
