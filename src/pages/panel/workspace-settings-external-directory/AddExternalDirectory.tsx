import { Trans, t } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import { LoadingButton } from '@mui/lab'
import { Button, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { Modal } from 'src/shared/modal'

export const AddExternalDirectory = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [defaultRole, setDefaultRole] = useState('')
  const showModalRef = useRef<(show?: boolean | undefined) => void>()

  const handleAction = () => {}

  const isPending = false
  return (
    <>
      <Button variant="contained" onClick={() => showModalRef.current?.(true)}>
        <Trans>Add external directory</Trans>
      </Button>
      <Modal
        openRef={showModalRef}
        actions={
          <LoadingButton
            loadingPosition={isPending ? 'end' : undefined}
            endIcon={<AddIcon />}
            loading={isPending}
            color="primary"
            variant="contained"
            onClick={handleAction}
          >
            <Trans>Add Directory</Trans>
          </LoadingButton>
        }
        title={<Trans>Invite External User</Trans>}
      >
        <Stack spacing={2}>
          <Stack direction="row">
            <Stack width={120} justifyContent="center">
              <Typography>
                <Trans>Name</Trans>:
              </Typography>
            </Stack>
            <Stack flexGrow={1}>
              <TextField size="small" onChange={(e) => setName(e.target.value)} value={name} placeholder={t`Name`} />
            </Stack>
          </Stack>
          <Stack direction="row">
            <Stack width={120} justifyContent="center">
              <Typography>
                <Trans>Type</Trans>:
              </Typography>
            </Stack>
            <Stack flexGrow={1}>
              <Select size="small" onChange={(e) => setType(e.target.value)} value={type}>
                <MenuItem value="generic-ldap">Generic LDAP</MenuItem>
                <MenuItem value="Google Workspace">Google Workspace</MenuItem>
                <MenuItem value="Azure Active Director">Azure Active Director</MenuItem>
                <MenuItem value="Microsoft Active Dire">Microsoft Active Dire</MenuItem>
                <MenuItem value="One Login">One Login</MenuItem>
                <MenuItem value="Okta">Okta</MenuItem>
              </Select>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Stack width={120} justifyContent="center">
              <Typography>
                <Trans>Default Role</Trans>:
              </Typography>
            </Stack>
            <Stack flexGrow={1}>
              <Select size="small" onChange={(e) => setDefaultRole(e.target.value)} value={defaultRole}>
                <MenuItem value="Guest">Guest</MenuItem>
                <MenuItem value="Notification">Notification</MenuItem>
                <MenuItem value="Report">Report</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </>
  )
}
