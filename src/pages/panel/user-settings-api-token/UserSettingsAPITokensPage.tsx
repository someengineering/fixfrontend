import { t, Trans } from '@lingui/macro'
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ButtonsRegion } from 'src/shared/layouts/panel-settings-layout'
import { getApiTokenQuery } from './getApiToken.query'
import { UserSettingsApiTokensAddToken } from './UserSettingsApiTokensAddToken'
import { UserSettingsApiTokensRow } from './UserSettingsApiTokensRow'

export default function UserSettingsAPITokensPage() {
  const { data } = useSuspenseQuery({ queryKey: ['api-token'], queryFn: getApiTokenQuery })
  return (
    <Stack my={-3.75} py={1.5}>
      <ButtonsRegion>
        <UserSettingsApiTokensAddToken forbiddenNames={data.map((i) => i.name)} />
      </ButtonsRegion>
      {data.length ? (
        <TableContainer>
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
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <UserSettingsApiTokensRow key={item.name} item={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Stack alignItems="center" justifyContent="center">
          <Typography variant="h5">
            <Trans>No API token has been created.</Trans>
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
