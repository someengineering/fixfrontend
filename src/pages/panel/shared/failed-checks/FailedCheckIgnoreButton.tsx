import { Trans } from '@lingui/macro'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import { Button, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material'
import { forwardRef, useRef } from 'react'
import { BlockIcon } from 'src/assets/icons'
import { Modal } from 'src/shared/modal'
import { usePersistState } from 'src/shared/utils/usePersistState'

interface FailedCheckIgnoreButtonProps extends Exclude<LoadingButtonProps, 'loading' | 'loadingPosition'> {
  currentIgnoreSecurityIssue?: string
  ignored?: boolean
  pending: boolean
  onToggle?: (currentIgnoreSecurityIssue: string, ignore: boolean) => void
}

export const FailedCheckIgnoreButton = forwardRef<HTMLButtonElement, FailedCheckIgnoreButtonProps>(
  ({ currentIgnoreSecurityIssue, ignored, pending, onToggle, startIcon, children, ...rest }, ref) => {
    const modalRef = useRef<(show?: boolean | undefined) => void>()
    const [acknowledge, setAcknowledge] = usePersistState<boolean>(
      'SetupTemplateButtonComponent.acknowledge' as never,
      false,
      (state) => typeof state === 'boolean',
    )
    const handleClick = () => {
      if (ignored || acknowledge) {
        onToggle?.(currentIgnoreSecurityIssue ?? '', !ignored)
      } else {
        modalRef.current?.(true)
      }
    }
    const handleModalClick = () => {
      onToggle?.(currentIgnoreSecurityIssue ?? '', !ignored)
      modalRef.current?.(false)
    }
    return (
      <>
        <Modal
          openRef={modalRef}
          actions={
            <Button onClick={handleModalClick} variant="outlined">
              <Trans>Confirm</Trans>
            </Button>
          }
          title={<Trans>Delayed Effect</Trans>}
        >
          <Typography variant="h6">
            <Trans>You've chosen to ignore this security check for the resource. Please note:</Trans>
          </Typography>
          <Typography>
            <Trans>
              The change will be active from the next security scan onwards. Until the next scan, the resource will still show the failing
              check.
            </Trans>
          </Typography>
          <Divider />
          <FormControlLabel
            control={<Checkbox checked={acknowledge} onChange={(_, checked) => setAcknowledge(checked)} />}
            label={<Trans>Do not show me again</Trans>}
          />
        </Modal>
        <LoadingButton
          onClick={handleClick}
          color={ignored ? 'primary' : 'warning'}
          loading={pending}
          loadingPosition={pending ? 'start' : undefined}
          startIcon={startIcon ?? <BlockIcon />}
          ref={ref}
          {...rest}
        >
          {children ?? (ignored ? <Trans>Enable</Trans> : <Trans>Ignore</Trans>)}
        </LoadingButton>
      </>
    )
  },
)
