import { Trans } from '@lingui/macro'
import { Box, Button, Divider, IconButton, LinearProgress, linearProgressClasses, Slide, Stack, Tooltip, Typography } from '@mui/material'
import { FC, Fragment, PropsWithChildren, ReactNode, useRef, useState } from 'react'
import { ArrowBackIcon, ArrowForwardIcon, HelpIcon, SvgIconProps } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { ExternalLinkButton } from 'src/shared/link-button'
import { RightSlider } from './RightSlider'

interface HelpSliderPropsPageItem {
  buttons?: {
    url: string
    Icon: FC<SvgIconProps>
    text: ReactNode
  }[]
  content: ReactNode
}

interface HelpSliderProps extends PropsWithChildren {
  data: HelpSliderPropsPageItem[]
}

export const HelpSlider = ({ children, data }: HelpSliderProps) => {
  const [open, setOpen] = useState(false)
  const [slide, setSlide] = useState(1)
  const previousValue = useRef(0)
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Typography variant="h4">{children}</Typography>
        <Tooltip title={<Trans>Learn more</Trans>}>
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
          <Typography variant="h4">
            <Trans>Learn more about {children}</Trans>
          </Typography>
        }
        overflow="initial"
        flex={1}
      >
        <Box flex={1} position="relative" sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
          {data.map(({ content, buttons }, i) => (
            <Slide
              key={i}
              in={slide === i + 1}
              direction={previousValue.current > slide ? (slide === i + 1 ? 'right' : 'left') : slide === i + 1 ? 'left' : 'right'}
            >
              <Stack position="absolute" top={0} spacing={3} p={3}>
                <Box>{content}</Box>
                {buttons?.length ? (
                  <Stack
                    borderRadius="6px"
                    direction={{ xs: 'column', lg: 'row' }}
                    border={({ palette }) => `1px solid ${palette.divider}`}
                    px={2}
                    py={1}
                    alignItems="center"
                  >
                    {buttons.map(({ Icon, text, url }, i) => (
                      <Fragment key={i}>
                        {i ? (
                          <Box display={{ xs: 'none', lg: 'block' }}>
                            <Divider orientation="vertical" sx={{ height: '16px' }} />
                          </Box>
                        ) : null}
                        <ExternalLinkButton
                          href={url}
                          variant="outlined"
                          sx={{ color: panelUI.uiThemePalette.text.sub, border: 'none' }}
                          startIcon={Icon ? <Icon /> : null}
                          noEndIcon
                          fullWidth
                        >
                          {text}
                        </ExternalLinkButton>
                      </Fragment>
                    ))}
                  </Stack>
                ) : null}
              </Stack>
            </Slide>
          ))}
        </Box>
        <Divider />
        {data.length > 1 ? (
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
        ) : null}
      </RightSlider>
    </>
  )
}
