import { Trans } from '@lingui/macro'
import { Box, Button, Divider, IconButton, LinearProgress, linearProgressClasses, Slide, Stack, Tooltip, Typography } from '@mui/material'
import { PropsWithChildren, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { ArrowBackIcon, ArrowForwardIcon, HelpIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { RightSlider } from './RightSlider'

interface HelpSliderPropsPageItem {
  header: ReactNode
  content: ReactNode
}

interface HelpSliderProps extends PropsWithChildren {
  slides: HelpSliderPropsPageItem[] | ((onClose: () => void) => HelpSliderPropsPageItem[])
}

export const HelpSlider = ({ children, slides }: HelpSliderProps) => {
  const [open, setOpen] = useState(false)
  const [slide, setSlide] = useState(1)
  const handleClose = useCallback(() => {
    setOpen(false)
    setSlide(1)
  }, [])
  const data = useMemo(() => (typeof slides === 'function' ? slides(handleClose) : slides), [slides, handleClose])
  const previousValue = useRef(0)
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Typography variant="h4">{children}</Typography>
        <Tooltip title={<Trans>Learn more</Trans>} arrow>
          <IconButton size="small" color="info" onClick={() => setOpen(true)}>
            <HelpIcon width={32} height={32} />
          </IconButton>
        </Tooltip>
      </Stack>
      <RightSlider
        open={open}
        onClose={() => {
          setOpen(false)
          setSlide(1)
        }}
        title={
          <Stack justifyContent="center" height="100%">
            <Typography variant="h4">{data[slide - 1]?.header}</Typography>
          </Stack>
        }
        titleContainerProps={{ px: 3, py: 3 }}
        overflow="initial"
        flex={1}
      >
        <Box flex={1} position="relative" sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
          {data.map(({ content }, i) => (
            <Slide
              key={i}
              in={slide === i + 1}
              appear={false}
              direction={previousValue.current > slide ? (slide === i + 1 ? 'right' : 'left') : slide === i + 1 ? 'left' : 'right'}
            >
              <Stack position="absolute" top={0} spacing={3} p={3}>
                <Box>{content}</Box>
              </Stack>
            </Slide>
          ))}
        </Box>
        {data.length > 1 ? (
          <>
            <Divider />
            <Stack direction="row" p={3} justifyContent="space-between" alignItems="center">
              <LinearProgress
                variant="determinate"
                color="inherit"
                value={100}
                sx={{
                  color: panelUI.uiThemePalette.text.sub,
                  height: 2,
                  width: 150,
                  [`.${linearProgressClasses.bar}`]: {
                    width: `${100 / data.length}%`,
                    transform: `translateX(${100 * (slide - 1)}%)!important`,
                  },
                }}
              />
              <Stack spacing={2} direction="row">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  disabled={slide <= 1}
                  onClick={() =>
                    setSlide((prev) => {
                      if (prev <= 1) {
                        return prev
                      }
                      previousValue.current = prev
                      return prev - 1
                    })
                  }
                >
                  <Trans>Previous</Trans>
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  disabled={slide >= data.length}
                  onClick={() =>
                    setSlide((prev) => {
                      if (prev >= data.length) {
                        return prev
                      }
                      previousValue.current = prev
                      return prev + 1
                    })
                  }
                >
                  <Trans>Next</Trans>
                </Button>
              </Stack>
            </Stack>
          </>
        ) : null}
      </RightSlider>
    </>
  )
}
