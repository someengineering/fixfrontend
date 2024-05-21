import { Trans } from '@lingui/macro'
import InfoIcon from '@mui/icons-material/Info'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Alert, AlertTitle, Badge, Box, Collapse, FormHelperText, Stack, Tab, Tooltip, Typography } from '@mui/material'
import { Suspense, useState } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryAdvanceSearchTextField } from './InventoryAdvanceSearchTextField'
import { InventoryForm, InventoryFormsSkeleton } from './inventory-form'

interface InventoryAdvanceSearchProps {
  hasChanges: boolean
  hasError: boolean
}

type TabsType = 'form' | 'advance'

export const InventoryAdvanceSearch = ({ hasError, hasChanges }: InventoryAdvanceSearchProps) => {
  const [tab, setTab] = useState<TabsType>('form')
  const { error, uiSimpleQuery, q } = useFixQueryParser()
  const hasSomethingExtra = !!q && q !== 'all' && !uiSimpleQuery

  return (
    <Box mb={2}>
      <TabContext value={error ? 'advance' : tab}>
        <Stack alignItems={{ xs: 'center', sm: 'end' }} borderColor="divider" borderBottom={1}>
          <TabList onChange={(_, val) => setTab(val as TabsType)} sx={{ minHeight: 'initial' }}>
            <Tab
              disabled={!!error}
              icon={<ListAltIcon />}
              iconPosition="start"
              label={
                hasSomethingExtra ? (
                  <Badge
                    slotProps={{
                      badge: {
                        style: { left: -30 },
                      },
                    }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                    badgeContent={
                      <Tooltip
                        title={
                          <Alert color="info" variant="outlined">
                            <Trans>
                              <AlertTitle>This search is complex.</AlertTitle>
                              The combo boxes below may not display all filter details but can help narrow your results. For full control,
                              please use the Advanced tab.
                            </Trans>
                          </Alert>
                        }
                      >
                        <InfoIcon color="info" />
                      </Tooltip>
                    }
                  >
                    <Trans>Form</Trans>
                  </Badge>
                ) : (
                  <Trans>Form</Trans>
                )
              }
              value="form"
              sx={{ minHeight: 'initial' }}
            />
            <Tab
              icon={<ManageSearchIcon />}
              iconPosition="start"
              label={<Trans>Advanced</Trans>}
              value="advance"
              sx={{ minHeight: 'initial' }}
            />
          </TabList>
        </Stack>
        <TabPanel value="form" sx={{ p: 0, pt: 1 }}>
          {!error ? (
            <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
              <Suspense fallback={<InventoryFormsSkeleton withChange={hasChanges} />}>
                <InventoryForm />
              </Suspense>
            </NetworkErrorBoundary>
          ) : null}
        </TabPanel>
        <TabPanel value="advance" sx={{ p: 0, pt: 1 }}>
          <InventoryAdvanceSearchTextField hasError={hasError} />
        </TabPanel>
      </TabContext>
      <Collapse in={!!error || hasError}>
        <FormHelperText>
          <Typography variant="caption" color="error" mx={1.75}>
            <Trans>Oops! It looks like your query didn't match our format. Please check and try again.</Trans>
          </Typography>
        </FormHelperText>
      </Collapse>
    </Box>
  )
}
