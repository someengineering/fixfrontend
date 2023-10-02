import { Trans } from '@lingui/macro'
import CopyAll from '@mui/icons-material/CopyAll'
import { Box, Button, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getExternalIdQuery, getOrganizationQuery } from 'src/pages/panel/shared-queries'

export const ExternalId = () => {
  const { data: organizationData } = useQuery(['organization'], getOrganizationQuery)
  const { data: ExternalIdData } = useQuery(['organization-external-id', organizationData?.[0].id], getExternalIdQuery, {
    enabled: !!organizationData?.[0].id,
  })
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(ExternalIdData || '')
    } catch {}
  }
  return (
    <>
      <Typography variant="h6" ml={2} p={2} bgcolor="grey.300">
        {ExternalIdData}
      </Typography>
      <Box ml={2}>
        <Button variant="contained" startIcon={<CopyAll />} onClick={handleCopy}>
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </>
  )
}
