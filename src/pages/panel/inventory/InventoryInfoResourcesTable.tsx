import { Trans } from '@lingui/macro'
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { BucketIcon, DatabaseIcon, HardDriveDiskIcon, InstanceIcon } from 'src/assets/icons'
import { InternalLink } from 'src/shared/link-button'
import { numberToReadableBytes, numberToReadableNumber } from 'src/shared/utils/numberToReadable'
import { wordToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'

interface InventoryInfoResourcesTableProps {
  durationName: string
  locale?: Intl.LocalesArgument
  instances_progress: [number, number]
  cores_progress: [number, number]
  memory_progress: [number, number]
  volumes_progress: [number, number]
  volume_bytes_progress: [number, number]
  databases_progress: [number, number]
  databases_bytes_progress: [number, number]
  buckets_objects_progress: [number, number]
  buckets_size_bytes_progress: [number, number]
}

export const InventoryInfoResourcesTable = ({
  durationName,
  locale,
  buckets_objects_progress,
  buckets_size_bytes_progress,
  cores_progress,
  databases_bytes_progress,
  databases_progress,
  instances_progress,
  memory_progress,
  volume_bytes_progress,
  volumes_progress,
}: InventoryInfoResourcesTableProps) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            <Typography variant="h4"></Typography>
          </TableCell>
          <TableCell>
            <Trans>Current</Trans>
          </TableCell>
          <TableCell>
            <Trans>Changes In {wordToUFStr(durationName)}</Trans>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell rowSpan={3}>
            <InternalLink
              to={{
                pathname: '/inventory/search',
                search: mergeLocationSearchValues({
                  q: encodeURIComponent(
                    'aggregate(/ancestors.cloud.reported.name as cloud, /ancestors.account.reported.name as account: sum(1) as instances_total, sum(instance_cores) as cores, sum(instance_memory) as memory_gb): is(instance) and instance_status = "running"',
                  ),
                }),
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <InstanceIcon width={24} height={24} color="primary.main" />
                <Typography variant="body2" fontWeight="bold">
                  <Trans>Compute</Trans>
                </Typography>
              </Stack>
            </InternalLink>
          </TableCell>
          <TableCell>
            <Trans>Virtual Machines</Trans>
          </TableCell>
          <TableCell>{numberToReadableNumber({ value: instances_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableNumber({ value: instances_progress[1], locale })}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Trans>Cores</Trans>
          </TableCell>
          <TableCell>{numberToReadableNumber({ value: cores_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableNumber({ value: cores_progress[1], locale })}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Trans>Memory</Trans>
          </TableCell>
          <TableCell>{numberToReadableBytes({ value: memory_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableBytes({ value: memory_progress[1], locale })}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell rowSpan={2}>
            <InternalLink
              to={{
                pathname: '/inventory/search',
                search: mergeLocationSearchValues({
                  q: encodeURIComponent(
                    'aggregate(/ancestors.cloud.reported.name as cloud, /ancestors.account.reported.name as account: sum(1) as volumes_total, sum(volume_size) as size_gb): is(volume)',
                  ),
                }),
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <HardDriveDiskIcon width={24} height={24} color="primary.main" />
                <Typography variant="body2" fontWeight="bold">
                  <Trans>Storage</Trans>
                </Typography>
              </Stack>
            </InternalLink>
          </TableCell>
          <TableCell>
            <Trans>Volumes</Trans>
          </TableCell>
          <TableCell>{numberToReadableNumber({ value: volumes_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableNumber({ value: volumes_progress[1], locale })}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Trans>Size</Trans>
          </TableCell>
          <TableCell>{numberToReadableBytes({ value: volume_bytes_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableBytes({ value: volume_bytes_progress[1], locale })}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell rowSpan={2}>
            <InternalLink
              to={{
                pathname: '/inventory/search',
                search: mergeLocationSearchValues({
                  q: encodeURIComponent(
                    'aggregate(/ancestors.cloud.reported.name as cloud, /ancestors.account.reported.name as account: sum(1) as buckets_total, sum(/usage.bucket_size_bytes.avg / 1024  / 1024  / 1024) as size_gb): is(bucket)',
                  ),
                }),
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <BucketIcon width={24} height={24} color="primary.main" />
                <Typography variant="body2" fontWeight="bold">
                  <Trans>Buckets</Trans>
                </Typography>
              </Stack>
            </InternalLink>
          </TableCell>
          <TableCell>
            <Trans>Objects</Trans>
          </TableCell>
          <TableCell>{numberToReadableNumber({ value: buckets_objects_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableNumber({ value: buckets_objects_progress[1], locale })}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Trans>Size</Trans>
          </TableCell>
          <TableCell>{numberToReadableBytes({ value: buckets_size_bytes_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableBytes({ value: buckets_size_bytes_progress[1], locale })}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell rowSpan={2}>
            <InternalLink
              to={{
                pathname: '/inventory/search',
                search: mergeLocationSearchValues({
                  q: encodeURIComponent(
                    'aggregate(/ancestors.cloud.reported.name as cloud, /ancestors.account.reported.name as account, db_type as type, instance_type as instance_type: sum(1) as databases_total, sum(volume_size) as volume_size_gb): is(database)',
                  ),
                }),
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <DatabaseIcon width={24} height={24} color="primary.main" />
                <Typography variant="body2" fontWeight="bold">
                  <Trans>Databases</Trans>
                </Typography>
              </Stack>
            </InternalLink>
          </TableCell>
          <TableCell>
            <Trans>Instances</Trans>
          </TableCell>
          <TableCell>{numberToReadableNumber({ value: databases_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableNumber({ value: databases_progress[1], locale })}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Trans>Size</Trans>
          </TableCell>
          <TableCell>{numberToReadableBytes({ value: databases_bytes_progress[0], locale })}</TableCell>
          <TableCell>{numberToReadableBytes({ value: databases_bytes_progress[1], locale })}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
)
