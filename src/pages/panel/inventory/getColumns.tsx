import { plural, t } from '@lingui/macro'
import { Avatar, Stack, Tooltip, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid-premium'
import { getNameAndIconFromMetadataGroup } from 'src/assets/icons'
import { CloudToIcon } from 'src/shared/cloud-avatar'
import { ResourceComplexKind } from 'src/shared/types/server-shared'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { stringAvatar } from 'src/shared/utils/stringAvatar'

export interface RowType {
  id: string
  cloud: string
  resources: number
  accounts: number
  regions: number
  group: string | null
  icon: string | null
  name: string | null
  base: string | null
  resource: ResourceComplexKind
}

export const getColumns = (_locale?: string) =>
  [
    {
      field: 'name',
      headerName: t`Resource kind`,
      flex: 1,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'string' && typeof v2 === 'string' ? v1.localeCompare(v2) : 0),
      renderCell: ({ row: { id, cloud, name, base } }) => (
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
            <Tooltip title={base ?? ''} arrow placement="bottom-start" enterDelay={250} enterNextDelay={250}>
              <Typography whiteSpace="nowrap" variant="subtitle2" color="textSecondary" overflow="hidden" textOverflow="ellipsis">
                {base ?? ''}
              </Typography>
            </Tooltip>
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'group',
      headerName: t`Group`,
      flex: 0.5,
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
      flex: 0.25,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'number' && typeof v2 === 'number' ? v1 - v2 : 0),
      renderCell: ({ row: { resources } }) => (
        <Stack direction="row" height="100%" alignItems="center">
          <Typography whiteSpace="nowrap" variant="subtitle1">
            {plural(resources, {
              one: '# resource',
              other: '# resources',
            })}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'accounts',
      headerName: t`Account usage`,
      flex: 0.25,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'number' && typeof v2 === 'number' ? v1 - v2 : 0),
      renderCell: ({ row: { accounts } }) => (
        <Stack direction="row" height="100%" alignItems="center">
          <Typography whiteSpace="nowrap" variant="subtitle1">
            {plural(accounts, {
              one: '# account',
              other: '# accounts',
            })}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'regions',
      headerName: t`Regions`,
      flex: 0.25,
      type: 'string',
      sortable: true,
      sortComparator: (v1: unknown, v2: unknown) => (typeof v1 === 'number' && typeof v2 === 'number' ? v1 - v2 : 0),
      renderCell: ({ row: { regions } }) => (
        <Stack direction="row" height="100%" alignItems="center">
          <Typography whiteSpace="nowrap" variant="subtitle1">
            {plural(regions, {
              one: '# region',
              other: '# regions',
            })}
          </Typography>
        </Stack>
      ),
    },
  ] as GridColDef<RowType>[]
