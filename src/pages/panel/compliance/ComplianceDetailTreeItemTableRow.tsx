import { Trans } from '@lingui/macro'
import { alpha, Box, Collapse, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { CheckIcon, ChevronRightIcon, ErrorIcon, KeyboardArrowDownIcon } from 'src/assets/icons'
import { CloudToIcon } from 'src/shared/cloud-avatar'
import { SeverityItemWithText } from 'src/shared/severity'
import { BenchmarkCheckResultNode } from 'src/shared/types/server'
import { snakeCaseWordsToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { ComplianceDetailCheckDetail } from './ComplianceDetailCheckDetail'
import { ComplianceCheckCollectionNodeWithChildren } from './ComplianceDetailTreeItem'
import { ComplianceDetailTreeItemTableMenu } from './ComplianceDetailTreeItemTableMenu'

export interface ComplianceDetailTreeItemTableRowProps {
  check: ComplianceCheckCollectionNodeWithChildren & { reported: BenchmarkCheckResultNode }
  accountName?: string
}

export const ComplianceDetailTreeItemTableRow = ({ check, accountName }: ComplianceDetailTreeItemTableRowProps) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <Stack
        direction="row"
        borderTop={({ palette }) => `1px solid ${palette.divider}`}
        alignItems="center"
        sx={{ cursor: 'pointer' }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Stack direction="row" spacing={1.5} p={2} pl={0} flexGrow={1} alignItems="center">
          {expanded ? <KeyboardArrowDownIcon color="text.secondary" /> : <ChevronRightIcon color="text.secondary" />}
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
        <Box p={2} flexShrink={0} width={160}>
          {check.severity ? <SeverityItemWithText severity={check.severity} /> : null}
        </Box>
        <Typography variant="subtitle1" p={2} flexShrink={0} width={120}>
          <Trans>{check.reported.number_of_resources_failing} Fail</Trans>
        </Typography>
        <Box p={2} flexShrink={0} width={87}>
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
        </Box>
        <Box p={2} flexShrink={0} width={94}>
          <ComplianceDetailTreeItemTableMenu check={check} accountName={accountName} />
        </Box>
      </Stack>
      <Collapse in={expanded}>
        <Stack
          borderRadius="12px"
          border={({ palette }) => `1px solid ${palette.divider}`}
          width="100%"
          overflow="hidden"
          px={3}
          py={1}
          my={1}
        >
          <ComplianceDetailCheckDetail
            check={check.reported}
            accountName={accountName}
            description={check?.parent?.reported?.kind === 'report_check_collection' ? check?.parent.reported.description : undefined}
          />
        </Stack>
      </Collapse>
    </>
  )
}
