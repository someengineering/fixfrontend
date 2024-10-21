import { Trans, t } from '@lingui/macro'
import { Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { getPermissions, useUserProfile } from 'src/core/auth'
import { InternalLinkButton } from 'src/shared/link-button'
import { Modal } from 'src/shared/modal'
import { postWorkspaceAckMoveToFreeMutation } from './postWorkspaceAckMoveToFree.mutation'

export const MoveToFreeAcknowledge = ({ workspaceId }: { workspaceId: string }) => {
  const { workspaces } = useUserProfile()
  const checkRef = useRef(false)
  const openRef = useRef<(show?: boolean) => void>()
  const { mutate } = useMutation({
    mutationFn: postWorkspaceAckMoveToFreeMutation,
    onSuccess: (newWorkspace) => {
      if (workspaces) {
        const workspaceIndex = workspaces.findIndex((workspace) => workspace.id === workspaceId)
        if (workspaceIndex > -1 && workspaces) {
          workspaces[workspaceIndex] = { ...newWorkspace.data, permissions: getPermissions(newWorkspace.data.user_permissions) }
        }
      }
    },
  })
  const handleClose = (close?: boolean) => {
    if (close) {
      openRef.current?.(false)
    }
    if (checkRef.current) {
      mutate({ workspaceId })
    }
  }
  return (
    <Modal
      onClose={handleClose}
      openRef={openRef}
      defaultOpen
      actions={
        <Stack direction="row" justifyContent="space-between" width="100%">
          <InternalLinkButton variant="contained" to="/settings/workspace/billing-receipts" onClick={() => handleClose(true)}>
            <Trans>Upgrade to Paid Tier</Trans>
          </InternalLinkButton>
          <Button variant="text" onClick={() => handleClose(true)}>
            <Trans>No Thanks</Trans>
          </Button>
        </Stack>
      }
      title={
        <Typography variant="h4" component="span">
          <Trans>Secure Your Cloud, Elevate Your Peace of Mind</Trans>
        </Typography>
      }
      description={
        <Typography>
          <Trans>
            <b>Thank you</b> for exploring the capabilities of Fix Security during your trial period!
            <br />
            You've seen firsthand how our platform transforms cloud security with continuous, comprehensive monitoring and protection.
            <br />
            <br />
            We have stopped synchronizing your cloud accounts and moved your workspace into the Free Tier.
            <br />
            One account will be synchronized on a monthly base, while no additional user is allowed to access this workspace.
          </Trans>
        </Typography>
      }
    >
      <Stack spacing={1}>
        <Trans>
          <Typography variant="h5">Why Upgrade to a Paid Tier?</Typography>
          <Typography>
            <i>
              <b>Continuous Protection:</b>
            </i>{' '}
            As your cloud environment grows and changes, Fix Security remains your steadfast partner in security, ensuring your
            infrastructure adapts to new threats seamlessly.
          </Typography>
          <Typography>
            <i>
              <b>Advanced Features:</b>
            </i>{' '}
            Gain deeper insights and more control with advanced features such as custom policies, expanded ticketing, and alerting systems.
            Harness the full potential of API integrations and webhooks for streamlined operations.
          </Typography>
          <Typography>
            <i>
              <b>Priority Support:</b>
            </i>{' '}
            Receive priority support from our dedicated team. We're here to assist you with faster response times and expert advice, helping
            you maintain an optimal security posture.
          </Typography>
          <Typography>
            <i>
              <b>Stay Ahead of Compliance:</b>
            </i>{' '}
            With regulations constantly evolving, our preconfigured benchmarks and dynamic compliance rules ensure you're always ahead,
            reducing risks and avoiding potential fines.
          </Typography>
          <FormControlLabel
            control={<Checkbox onChange={(e) => (checkRef.current = e.currentTarget.checked)} />}
            label={t`Do not show this message again.`}
          />
        </Trans>
      </Stack>
    </Modal>
  )
}
