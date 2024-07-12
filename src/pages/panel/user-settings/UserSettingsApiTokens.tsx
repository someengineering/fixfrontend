import { t, Trans } from '@lingui/macro'
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getApiTokenQuery } from './getApiToken.query'
import { UserSettingsApiTokensAddToken } from './UserSettingsApiTokensAddToken'
import { UserSettingsApiTokensRow } from './UserSettingsApiTokensRow'

export const UserSettingsApiTokens = () => {
  const { data } = useSuspenseQuery({ queryKey: ['api-token'], queryFn: getApiTokenQuery })

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between">
        <Typography variant="h3">
          <Trans>API Tokens</Trans>
        </Typography>
        <UserSettingsApiTokensAddToken forbiddenNames={data.map((i) => i.name)} />
      </Stack>
      <TableContainer component={Paper}>
        <Table aria-label={t`API Tokens`}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Description</Trans>
              </TableCell>
              <TableCell>
                <Trans>Created</Trans>
              </TableCell>
              <TableCell>
                <Trans>Last used</Trans>
              </TableCell>
              <TableCell>
                <Trans>Delete</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <UserSettingsApiTokensRow key={item.name} item={item} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
