import { Trans } from '@lingui/macro'
import { Button, IconButton, Skeleton, Stack, Step, StepContent, StepLabel, Stepper, Typography, styled } from '@mui/material'
import { useEffect, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { ArrowBackIcon, ArrowForwardIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { useNonce } from 'src/shared/providers'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { getInstructions, maxInstructionImageWidth } from './getInstructions'

interface WorkspaceSettingsAccountsSetupCloudGCPInstructionsProps {
  isMobile: boolean
}

const StyledImage = styled(LazyLoadImage)(({ theme, width }) => ({
  width: '100%',
  maxWidth: width,
  height: 'auto',
  borderRadius: 16,
  boxShadow: theme.shadows['6'],
  backgroundColor: theme.palette.grey['400'],
}))

export const WorkspaceSettingsAccountsSetupCloudGCPInstructions = ({
  isMobile,
}: WorkspaceSettingsAccountsSetupCloudGCPInstructionsProps) => {
  const nonce = useNonce()
  const instructions = getInstructions(isMobile)
  const [activeStep, setActiveStep] = usePersistState<number>(
    'WorkspaceSettingsAccountsSetupCloudGCP.activeStep',
    0,
    (state) => typeof state === 'number' && state < instructions.length && state >= 0,
  )
  const timeout = useRef<number>()
  const justMounted = useRef(true)

  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current)
    }
    if (activeStep > 0 || !justMounted.current) {
      timeout.current = window.setTimeout(() => {
        const parentElement = window.document.querySelector(`#workspace-settings-accounts-setup-cloud-gcp-label-${activeStep}`)
        if (parentElement) {
          parentElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, panelUI.fastTooltipDelay + 50)
      return () => {
        window.clearTimeout(timeout.current)
      }
    }
    justMounted.current = false
  }, [activeStep])

  return (
    <Stack
      spacing={2}
      p={{ sx: 2.5, lg: 3.75 }}
      borderRadius="12px"
      border={`1px solid ${panelUI.uiThemePalette.input.border}`}
      height={isMobile ? undefined : '100%'}
      width="100%"
      flex={0.5}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        // position="sticky"
        // top={{ xs: -20, lg: -30 }}
        // mx={{ sx: -2.5, lg: -3.75 }}
        // px={{ sx: 2.5, lg: 3.75 }}
        // py={1}
        // bgcolor="background.paper"
        // zIndex={({ zIndex }) => zIndex.drawer + 1}
      >
        <Typography variant="h4">How to get the file</Typography>
        <Stack direction="row" spacing={1.5}>
          <IconButton
            sx={{ border: `1px solid ${panelUI.uiThemePalette.input.border}`, borderRadius: '6px' }}
            onClick={() => setActiveStep(activeStep - 1)}
            disabled={activeStep < 1}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            sx={{ border: `1px solid ${panelUI.uiThemePalette.input.border}`, borderRadius: '6px' }}
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={activeStep >= instructions.length - 1}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Stack maxWidth={maxInstructionImageWidth} flex={1} minHeight={300} overflow={isMobile ? undefined : 'auto'}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {instructions.map(({ instruction, label, divComponent, image }, index) => (
            <Step key={index}>
              <StepLabel id={`workspace-settings-accounts-setup-cloud-gcp-label-${index}`} onClick={() => setActiveStep(index)}>
                {label}
              </StepLabel>
              <StepContent transitionDuration={panelUI.fastTooltipDelay}>
                <Stack spacing={2}>
                  <Typography component={divComponent ? 'div' : 'p'} fontWeight={600}>
                    {instruction}
                  </Typography>
                  {image ? (
                    <StyledImage
                      src={image.src}
                      height={image.height}
                      width={image.width}
                      effect="opacity"
                      placeholder={<Skeleton width={image.width} height={image.height} variant="rounded" />}
                      wrapperProps={{
                        nonce,
                        style: {
                          color: 'transparent',
                          display: 'inline-block',
                          height: 'auto',
                          width: '100%',
                          maxWidth: image.width,
                        },
                      }}
                    />
                  ) : null}
                  <Stack direction="row" spacing={1}>
                    {instructions.length - 1 > index ? (
                      <Button onClick={() => setActiveStep(index + 1)} variant="contained">
                        <Trans>Continue</Trans>
                      </Button>
                    ) : null}
                    {index ? (
                      <Button onClick={() => setActiveStep(index - 1)}>
                        <Trans>Back</Trans>
                      </Button>
                    ) : null}
                  </Stack>
                </Stack>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </Stack>
  )
}
