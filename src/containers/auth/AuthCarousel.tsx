import { useLingui } from '@lingui/react'
import { Avatar, LinearProgress, linearProgressClasses, Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { SwipeDirection, useSwipe } from 'src/shared/utils/useSwipe'
import { getQuotes, QuoteType } from './getQuotes'

const QuoteContainer = styled(Stack, { shouldForwardProp: shouldForwardPropWithBlackList(['active']) })<{ active?: boolean }>(
  ({ active, theme }) => ({
    opacity: active ? 1 : 0,
    position: active ? 'static' : 'absolute',
    top: 0,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeOut,
    }),
    animationDuration: active ? `${theme.transitions.duration.standard / 1000}s` : undefined,
    animationFillMode: active ? 'forwards' : undefined,
    animationTimingFunction: active ? theme.transitions.easing.easeIn : undefined,
    animationName: active ? 'fadeIn' : undefined,
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    },
  }),
)

const QuoteComponent = ({ quote, active }: { quote: QuoteType; active?: boolean }) => {
  const {
    transitions: {
      duration: { standard },
    },
  } = useTheme()
  const [show, setShow] = useState(active)
  useEffect(() => {
    if (active) {
      setShow(true)
    } else {
      const timeout = window.setTimeout(() => setShow(false), standard)
      return () => window.clearTimeout(timeout)
    }
  }, [active, standard])
  return show ? (
    <QuoteContainer active={active} spacing={5}>
      <Typography variant="bodyBigger" fontWeight="bold" color={panelUI.uiThemePalette.primary.white}>
        “{quote.text}”
      </Typography>
      <Stack width="100%" direction="row" alignItems="center">
        <Avatar alt={quote.name} src={quote.src} sx={{ width: 60, height: 60 }} />
        <Stack py={1.75} px={2}>
          <Typography variant="body2" fontWeight={700} color={panelUI.uiThemePalette.primary.white}>
            {quote.name}
          </Typography>
          <Typography variant="subtitle1" color={panelUI.uiThemePalette.primary.white}>
            {quote.position}
          </Typography>
        </Stack>
      </Stack>
    </QuoteContainer>
  ) : null
}

const getNextSlideMethod = (quotes: readonly QuoteType[]) => (prev: number) => (quotes[prev + 1] ? prev + 1 : 0)
const getPrevSlideMethod = (quotes: readonly QuoteType[]) => (prev: number) => (prev > 0 ? prev - 1 : quotes.length - 1)

export const AuthCarousel = () => {
  const {
    i18n: { locale },
  } = useLingui()
  const { quotes, nextSlide, prevSlide } = useMemo(() => {
    const quotes = getQuotes()
    return {
      quotes,
      nextSlide: getNextSlideMethod(quotes),
      prevSlide: getPrevSlideMethod(quotes),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])
  const containerRef = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(0)
  const timeoutRef = useRef<number>()
  useEffect(() => {
    timeoutRef.current = window.setInterval(setSlide, panelUI.slideDuration, nextSlide)
    return () => window.clearInterval(timeoutRef.current)
  }, [nextSlide])
  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (direction === 'LEFT' || direction === 'RIGHT') {
        setSlide(direction === 'RIGHT' ? prevSlide : nextSlide)
        window.clearInterval(timeoutRef.current)
        timeoutRef.current = window.setInterval(setSlide, panelUI.slideDuration, nextSlide)
      }
    },
    [nextSlide, prevSlide],
  )
  useSwipe({
    ref: containerRef,
    onSwipe: handleSwipe,
  })
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))
  return isMobile ? null : (
    <Stack
      width="100%"
      height="100%"
      px={10}
      py={10}
      alignItems="center"
      justifyContent="center"
      spacing={12.5}
      ref={containerRef}
      sx={{ cursor: 'grab', ':active': { cursor: 'grabbing' } }}
    >
      <Stack width="100%" position="relative">
        {quotes.map((quote, i) => (
          <QuoteComponent quote={quote} key={i} active={slide === i} />
        ))}
      </Stack>
      <Stack mt={7.5} width="100%">
        <LinearProgress
          variant="determinate"
          color="inherit"
          value={100}
          sx={{
            color: panelUI.uiThemePalette.primary.white,
            height: 2,
            width: 150,
            [`.${linearProgressClasses.bar}`]: { width: `${100 / quotes.length}%`, transform: `translateX(${100 * slide}%)!important` },
          }}
        />
      </Stack>
    </Stack>
  )
}
