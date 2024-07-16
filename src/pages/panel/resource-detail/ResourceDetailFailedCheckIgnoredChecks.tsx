import { Trans } from '@lingui/macro'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Alert, FormControlLabel, Stack, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import { FailedCheckIgnoreButton } from 'src/pages/panel/shared/failed-checks'

interface ResourceDetailFailedCheckIgnoredChecksProps {
  securityIgnore: '*' | string[]
  ignoredChecks: string[][]
  handleAllToggle: () => void
  handleToggle: (item: string, ignore: boolean) => void
  isPending: boolean
}

export const ResourceDetailFailedCheckIgnoredChecks = ({
  securityIgnore,
  handleAllToggle,
  isPending,
  ignoredChecks,
  handleToggle,
}: ResourceDetailFailedCheckIgnoredChecksProps) => {
  const [persistIgnoredChecks, setPersistIgnoredChecks] = useState(ignoredChecks)
  useEffect(() => {
    setPersistIgnoredChecks((prev) => [...prev, ...ignoredChecks.filter(([key]) => !prev.find(([key2]) => key === key2))])
  }, [ignoredChecks])
  return (
    <Alert
      severity={securityIgnore === '*' ? 'error' : 'warning'}
      action={
        securityIgnore === '*' ? (
          <FailedCheckIgnoreButton
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation()
              handleAllToggle()
            }}
            ignored={securityIgnore === '*'}
            size="small"
            pending={isPending}
            startIcon={securityIgnore === '*' ? <DoneAllIcon /> : undefined}
          >
            {securityIgnore === '*' ? <Trans>Enable all</Trans> : <Trans>Ignore all</Trans>}
          </FailedCheckIgnoreButton>
        ) : null
      }
    >
      {securityIgnore === '*' ? (
        <Trans>All checks have been disabled for this resource</Trans>
      ) : (
        <Stack spacing={1}>
          <Trans>Some checks have been disabled for this resource</Trans>
          <Stack spacing={1}>
            {persistIgnoredChecks.map((item) => (
              <FormControlLabel
                key={item[0]}
                control={
                  <Switch
                    defaultChecked
                    size="small"
                    color="warning"
                    disabled={isPending}
                    onChange={(_, ignore) => handleToggle(item[0], ignore)}
                  />
                }
                label={item[1]}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </Alert>
  )
}
