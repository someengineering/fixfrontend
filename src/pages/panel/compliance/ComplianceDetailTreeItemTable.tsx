import { Trans } from '@lingui/macro'
import { alpha, Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { CheckIcon, ErrorIcon } from 'src/assets/icons'
import { CloudToIcon } from 'src/shared/cloud-avatar'
import { BenchmarkCheckResultNode } from 'src/shared/types/server'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { ComplianceCheckCollectionNodeWithChildren } from './ComplianceDetailTreeItem'
import { ComplianceDetailTreeItemTableMenu } from './ComplianceDetailTreeItemTableMenu'

interface ComplianceDetailTreeItemTableProps {
  item: (ComplianceCheckCollectionNodeWithChildren & { reported: BenchmarkCheckResultNode })[]
  accountName?: string
}

export const ComplianceDetailTreeItemTable = ({ item, accountName }: ComplianceDetailTreeItemTableProps) => {
  return (
    <Box borderRadius="12px" border={({ palette }) => `1px solid ${palette.divider}`} width="100%" overflow="hidden" px={3} py={1} my={1}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Resource kind</Trans>
            </TableCell>
            <TableCell width={160}>
              <Trans>Severity</Trans>
            </TableCell>
            <TableCell width={120}>
              <Trans>Resources</Trans>
            </TableCell>
            <TableCell width={87}></TableCell>
            <TableCell width={94}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item.map((check) => (
            <TableRow key={check.nodeId} id={check.nodeId}>
              <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CloudToIcon cloud={check.reported.provider} />
                  <Stack>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {check.reported.title}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {check.reported.result_kinds.length
                        ? check.reported.result_kinds.map(snakeCaseWordsToUFStr).join(', ')
                        : check.reported.categories.map(snakeCaseWordsToUFStr).join(', ')}
                    </Typography>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1">{check.reported.severity}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  <Trans>{check.reported.number_of_resources_failing} Fail</Trans>
                </Typography>
              </TableCell>
              <TableCell>
                <Stack
                  direction="row"
                  borderRadius="6px"
                  alignItems="center"
                  width="fit-content"
                  spacing={0.5}
                  py={0.5}
                  px={1}
                  bgcolor={
                    check.isManual
                      ? undefined
                      : ({ palette }) => alpha(palette[check.reported.number_of_resources_failing === 0 ? 'success' : 'error'].main, 0.1)
                  }
                >
                  {check.isManual ? (
                    <Typography variant="subtitle1" whiteSpace="nowrap">
                      <Trans>No resources</Trans>
                    </Typography>
                  ) : check.reported.number_of_resources_failing === 0 ? (
                    <>
                      <CheckIcon color="success.main" />
                      <Typography variant="subtitle2" fontWeight={700} color="success">
                        <Trans>Passed</Trans>
                      </Typography>
                    </>
                  ) : (
                    <>
                      <ErrorIcon color="error.main" />
                      <Typography variant="subtitle2" fontWeight={700} color="error">
                        <Trans>Failed</Trans>
                      </Typography>
                    </>
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                <ComplianceDetailTreeItemTableMenu check={check} accountName={accountName} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
