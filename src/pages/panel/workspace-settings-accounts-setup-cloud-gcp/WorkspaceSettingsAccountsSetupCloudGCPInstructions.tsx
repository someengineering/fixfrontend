import { Trans } from '@lingui/macro'
import { Button, Skeleton, Stack, Step, StepContent, StepLabel, Stepper, Typography, styled } from '@mui/material'
import { useEffect, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
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
  const [activeStep, setActiveStep] = usePersistState('WorkspaceSettingsAccountsSetupCloudGCP.activeStep', 0)
  const timeout = useRef<number>()
  const instructions = getInstructions(isMobile)

  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current)
    }
    timeout.current = window.setTimeout(() => {
      const parentElement = window.document.querySelector(`#workspace-settings-accounts-setup-cloud-gcp-label-${activeStep}`)
      if (parentElement) {
        parentElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, panelUI.fastTooltipDelay + 50)
    return () => {
      window.clearTimeout(timeout.current)
    }
  }, [activeStep])

  return (
    <Stack
      maxWidth={maxInstructionImageWidth}
      flex={1}
      minHeight={300}
      overflow={isMobile ? undefined : 'auto'}
      // TODO: fix layout in a way that the content can be easily set to maximize height
      height={isMobile ? undefined : 'calc(100vh - 235px)'}
    >
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
  )
}
