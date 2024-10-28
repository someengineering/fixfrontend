import { t, Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { FixLogo } from 'src/assets/icons'
import { RightSlider } from 'src/shared/right-slider'
import { roleOptions } from './roleOptions'

interface InviteExternalUserFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string, email: string, roles: string[]) => void
  isEdit?: boolean
  isPending?: boolean
  defaultName?: string
  defaultEmail?: string
  defaultRoles?: string[]
}

export const InviteExternalUserForm = ({
  open,
  onClose,
  onSubmit,
  isEdit = false,
  isPending = false,
  defaultName = '',
  defaultEmail = '',
  defaultRoles = [],
}: InviteExternalUserFormProps) => {
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [roles, setRoles] = useState(defaultRoles)
  const [triedToSubmit, setTriedToSubmit] = useState(false)
  const handleClose = () => {
    onClose()
    setName(defaultName)
    setEmail(defaultEmail)
    setRoles(defaultRoles)
    setTriedToSubmit(false)
  }
  const handleSubmit = () => {
    setTriedToSubmit(true)
    if (email && name && roles.length) {
      onSubmit(name, email, roles)
    }
  }
  return (
    <RightSlider
      noTitleDivider
      open={open}
      spacing={3.75}
      height="100%"
      pt={4.5}
      onClose={handleClose}
      title={
        <Stack bgcolor="background.default" height="100%" width="100%" position="absolute" left="0" top="0">
          <Box borderRadius="50%" width={72} height={72} overflow="hidden" bottom={-36} position="absolute" ml={3}>
            <FixLogo width={72} height={72} color="primary.main" />
          </Box>
        </Stack>
      }
    >
      <Stack spacing={3.75} flex={1} p={3}>
        <Stack direction="row" gap={3} flexWrap="wrap" width="100%">
          <Stack spacing={0.5} flex={1}>
            <Typography color="textSecondary" variant="subtitle1" fontWeight={500}>
              <Trans>Name</Trans>
            </Typography>
            <TextField
              required
              error={!name && triedToSubmit}
              helperText={!name && triedToSubmit ? <Trans>Name is required</Trans> : null}
              size="small"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder={t`Name`}
            />
          </Stack>
          <Stack spacing={0.5} flex={1}>
            <Typography color="textSecondary" variant="subtitle1" fontWeight={500}>
              <Trans>Email</Trans>
            </Typography>
            <TextField
              required
              error={!email && triedToSubmit}
              helperText={!email && triedToSubmit ? <Trans>Email is required</Trans> : null}
              size="small"
              autoComplete="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder={t`Email`}
            />
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h6">
            <Trans>Assign roles</Trans> *
          </Typography>
          <FormGroup aria-required>
            {roleOptions.map(({ role, name }) => (
              <FormControlLabel
                key={role}
                control={
                  <Checkbox
                    checked={roles.includes(role)}
                    onChange={(_, checked) =>
                      setRoles((prev) => (checked ? [...prev, role] : prev.filter((prevRole) => prevRole !== role)))
                    }
                  />
                }
                label={name}
              />
            ))}
          </FormGroup>
          {!roles.length && triedToSubmit ? (
            <Typography variant="subtitle2" color="error">
              <Trans>Select at least one role</Trans>
            </Typography>
          ) : null}
        </Stack>
      </Stack>
      <Divider flexItem />
      <Stack direction="row" pb={3} px={3} spacing={2} justifyContent="end">
        <Button variant="outlined" onClick={handleClose}>
          <Trans>Cancel</Trans>
        </Button>
        <LoadingButton loading={isPending} color="primary" variant="contained" onClick={handleSubmit}>
          {isEdit ? <Trans>Save changes</Trans> : <Trans>Send Invite</Trans>}
        </LoadingButton>
      </Stack>
    </RightSlider>
  )
}
