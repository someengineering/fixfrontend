import { Trans } from '@lingui/macro'
import { Button, Skeleton, Stack, Step, StepContent, StepLabel, Stepper, Typography, styled } from '@mui/material'
import { PropsWithChildren, useEffect, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { panelUI } from 'src/shared/constants'
import { useNonce } from 'src/shared/providers'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { getInstructions, maxInstructionImageWidth } from './getInstructions'

interface WorkspaceSettingsAccountsSetupCloudAzureInstructionsProps extends PropsWithChildren {
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

export const WorkspaceSettingsAccountsSetupCloudAzureInstructions = ({
  isMobile,
  children,
}: WorkspaceSettingsAccountsSetupCloudAzureInstructionsProps) => {
  const nonce = useNonce()
  const instructions = getInstructions(isMobile)
  const [activeStep, setActiveStep] = usePersistState<number>(
    'WorkspaceSettingsAccountsSetupCloudAzure.activeStep',
    0,
    (state) => typeof state === 'number' && state < instructions.length && state >= 0,
  )
  const timeout = useRef<number>()

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
      height="100%"
      width="100%"
      border={`1px solid ${panelUI.uiThemePalette.primary.divider}`}
      borderRadius="12px"
      p={{ sx: 2.5, lg: 3.75 }}
      spacing={2}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {instructions.map(({ instruction, label, divComponent, image }, index) => (
          <Step key={index}>
            <StepLabel
              id={`workspace-settings-accounts-setup-cloud-gcp-label-${index}`}
              onClick={() => setActiveStep(index)}
              sx={activeStep === index ? undefined : { cursor: 'pointer!important' }}
            >
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
                    height={image.height / 2}
                    width={image.width / 2}
                    effect="opacity"
                    placeholder={<Skeleton width={image.width / 2} height={image.height / 2} variant="rounded" />}
                    wrapperProps={{
                      nonce,
                      style: {
                        color: 'transparent',
                        display: 'inline-block',
                        height: 'auto',
                        width: '100%',
                        maxWidth: image.width / 2,
                      },
                    }}
                  />
                ) : null}
                <Stack direction="row" spacing={1}>
                  {instructions.length - 1 > index ? (
                    <Button onClick={() => setActiveStep(index + 1)} variant="contained">
                      <Trans>Continue</Trans>
                    </Button>
                  ) : (
                    children
                  )}
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
