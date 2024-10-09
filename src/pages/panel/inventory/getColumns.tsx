import { t, Trans } from '@lingui/macro'
import { Avatar, Stack, Tooltip, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid-premium'
import { getNameAndIconFromMetadataGroup } from 'src/assets/icons'
import { CloudToIcon } from 'src/shared/cloud-avatar'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { stringAvatar } from 'src/shared/utils/stringAvatar'

export interface RowType {
  categories: string | null
  description: string | null
  group: string | null
  icon: string | null
  name: string | null
  service: string | null
  id: string
  cloud: string
  resources: number
  accounts: number
  regions: number
}

export const getColumns = (locale?: string) =>
  [
    {
      field: 'name',
      headerName: t`Resource kind`,
      flex: 1,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'string' && typeof v2 === 'string' ? v1.localeCompare(v2) : 0),
      renderCell: ({ row: { id, cloud, name, service } }) => (
        <Stack direction="row" spacing={1} key={id} height="100%" alignItems="center" overflow="hidden">
          <Tooltip title={getAccountCloudName(cloud)} arrow placement="right">
            <Stack width={56} height={38} alignItems="center" justifyContent="center">
              {['azure', 'fix', 'aws', 'gcp'].includes(cloud.toLocaleLowerCase()) ? (
                <CloudToIcon cloud={cloud} width={56} />
              ) : (
                <Avatar {...stringAvatar(cloud ?? '')} />
              )}
            </Stack>
          </Tooltip>
          <Stack height={38} flex={1} overflow="hidden">
            <Tooltip title={name ?? id} arrow placement="bottom-start" enterDelay={250} enterNextDelay={250}>
              <Typography whiteSpace="nowrap" variant="subtitle1" fontWeight={500} overflow="hidden" textOverflow="ellipsis">
                {name ?? id}
              </Typography>
            </Tooltip>
            <Tooltip title={service ?? ''} arrow placement="bottom-start" enterDelay={250} enterNextDelay={250}>
              <Typography whiteSpace="nowrap" variant="subtitle2" color="textSecondary" overflow="hidden" textOverflow="ellipsis">
                {service ?? ''}
              </Typography>
            </Tooltip>
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'group',
      headerName: t`Group`,
      flex: 1,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'string' && typeof v2 === 'string' ? v1.localeCompare(v2) : 0),
      renderCell: ({ row: { group } }) => {
        const { name, Icon } = getNameAndIconFromMetadataGroup(group ?? '')
        return (
          <Stack direction="row" spacing={0.75} height="100%" alignItems="center">
            <Icon />
            <Typography whiteSpace="nowrap" variant="subtitle1">
              {name}
            </Typography>
          </Stack>
        )
      },
    },
    {
      field: 'resources',
      headerName: t`Resource count`,
      flex: 1,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'number' && typeof v2 === 'number' ? v1 - v2 : 0),
      renderCell: ({ row: { resources } }) => (
        <Stack direction="row" height="100%" alignItems="center">
          <Typography whiteSpace="nowrap" variant="subtitle1">
            <Trans>{resources.toLocaleString(locale)} resources</Trans>
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'accounts',
      headerName: t`Account usage`,
      flex: 1,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'number' && typeof v2 === 'number' ? v1 - v2 : 0),
      renderCell: ({ row: { accounts } }) => (
        <Stack direction="row" height="100%" alignItems="center">
          <Typography whiteSpace="nowrap" variant="subtitle1">
            <Trans>{accounts.toLocaleString(locale)} accounts</Trans>
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'regions',
      headerName: t`Regions`,
      flex: 1,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'number' && typeof v2 === 'number' ? v1 - v2 : 0),
      renderCell: ({ row: { regions } }) => (
        <Stack direction="row" height="100%" alignItems="center">
          <Typography whiteSpace="nowrap" variant="subtitle1">
            <Trans>{regions.toLocaleString(locale)} regions</Trans>
          </Typography>
        </Stack>
      ),
    },
  ] as GridColDef<RowType>[]
