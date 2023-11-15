import { Trans } from '@lingui/macro'
import { Autocomplete, Box, Divider, Grid, Stack, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventorySearchStartQuery } from 'src/pages/panel/shared/queries'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { InventoryAdvanceSearchConfig } from './InventoryAdvanceSearch'
import { InventoryFormFilterRow } from './InventoryFormFilterRow'
import { InventoryFormTemplateObject, InventoryFormTemplates } from './InventoryFormTemplates'
import { getArrayFromInOP } from './utils'
import { defaultKeys } from './utils/constants'

interface InventoryFormProps {
  setConfig: Dispatch<SetStateAction<InventoryAdvanceSearchConfig[]>>
  searchCrit: string
  kind: string | null
  setKind: (kind: string | null) => void
  config: InventoryAdvanceSearchConfig[]
}

export const InventoryForm = ({ searchCrit, kind, setKind, config, setConfig }: InventoryFormProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data: startData = { accounts: [], kinds: [], regions: [], severity: [] } } = useQuery({
    queryKey: ['workspace-inventory-search-start', selectedWorkspace?.id],
    queryFn: getWorkspaceInventorySearchStartQuery,
    enabled: !!selectedWorkspace?.id,
  })
  const processedStartData = useMemo(() => {
    const clouds: string[] = []
    let biggestLength = startData.accounts.length
    if (startData.kinds.length > biggestLength) {
      biggestLength = startData.kinds.length
    }
    if (startData.regions.length > biggestLength) {
      biggestLength = startData.regions.length
    }
    for (let index = 0; index < biggestLength; index++) {
      let cloud = startData.accounts[index]?.cloud
      if (cloud && !clouds.includes(cloud)) {
        clouds.push(cloud)
      }
      cloud = startData.kinds[index]?.cloud
      if (cloud && !clouds.includes(cloud)) {
        clouds.push(cloud)
      }
      cloud = startData.regions[index]?.cloud
      if (cloud && !clouds.includes(cloud)) {
        clouds.push(cloud)
      }
    }
    return {
      clouds,
      ...startData,
    }
  }, [startData])
  const selectedClouds = useMemo(() => {
    for (let index = 0; index < config.length; index++) {
      const currentConfig = config[index]
      if (typeof currentConfig !== 'string' && currentConfig) {
        if (currentConfig.key === 'cloud' && currentConfig.value) {
          const cloud = currentConfig.value
          if (currentConfig.op === '=') {
            return [cloud]
          } else if (currentConfig.op === 'in') {
            return getArrayFromInOP(cloud)
          } else if (currentConfig.op === '~') {
            return processedStartData.clouds.filter((i) => i.match(cloud))
          } else if (currentConfig.op === '!~') {
            return processedStartData.clouds.filter((i) => !i.match(cloud))
          }
        }
      }
    }
    return []
  }, [config, processedStartData.clouds])
  const filteredStartData = useMemo(
    () => ({
      accounts: (selectedClouds.length
        ? processedStartData.accounts.filter((account) => selectedClouds.includes(account.cloud))
        : processedStartData.accounts
      ).map((account, _, accounts) => ({
        value: account.id,
        label: accounts.find(({ name, id }) => name === account.name && id !== account.id)
          ? `${account.name} (${account.id})`
          : account.name,
      })),
      kinds: (selectedClouds.length
        ? processedStartData.kinds.filter((kind) => selectedClouds.includes(kind.cloud))
        : processedStartData.kinds
      ).map((kind, _, kinds) => ({
        value: kind.id,
        label: kinds.find(({ name, id }) => name === kind.name && id !== kind.id) ? `${kind.name} (${kind.id})` : kind.name,
      })),
      regions: (selectedClouds.length
        ? processedStartData.regions.filter((region) => selectedClouds.includes(region.cloud))
        : processedStartData.regions
      ).map((region, _, regions) => ({
        value: region.id,
        label: regions.find(({ name, id }) => name === region.name && id !== region.id) ? `${region.name} (${region.id})` : region.name,
      })),
      severities: processedStartData.severity.map((severity) => ({ label: severity, value: severity })),
      clouds: processedStartData.clouds.map((cloud) => ({ label: cloud.toUpperCase(), value: cloud })),
    }),
    [processedStartData, selectedClouds],
  )
  const kindValue = kind ? filteredStartData.kinds.find((i) => i.value === kind) ?? null : null
  const handleAddTemplate = ({ selectAccount, selectCloud, selectRegion, selectSeverity, selectTag }: InventoryFormTemplateObject) => {
    setConfig((prev) => {
      const newValue = [...prev]
      if (selectAccount) {
        newValue.push({
          id: Math.random(),
          key: 'account',
          op: '=',
          value: selectAccount,
          kindProp: defaultKeys.account,
        })
      }
      if (selectCloud) {
        newValue.push({
          id: Math.random(),
          key: 'cloud',
          op: '=',
          value: selectCloud,
          kindProp: defaultKeys.cloud,
        })
      }
      if (selectRegion) {
        newValue.push({
          id: Math.random(),
          key: 'region',
          op: '=',
          value: selectRegion,
          kindProp: defaultKeys.region,
        })
      }
      if (selectSeverity) {
        newValue.push({
          id: Math.random(),
          key: 'severity',
          op: 'in',
          value: selectSeverity,
          kindProp: defaultKeys.severity,
        })
      }
      if (selectTag) {
        newValue.push({
          id: Math.random(),
          key: selectTag,
          op: null,
          value: null,
          kindProp: null,
        })
      }
      return newValue
    })
  }
  return (
    <>
      <InventoryFormTemplates searchCrit={searchCrit} addTemplate={handleAddTemplate} startData={filteredStartData} />
      <Box my={2}>
        <Divider />
      </Box>
      <Grid container spacing={1} direction="row" mb={2}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Autocomplete
            size="small"
            disablePortal
            sx={{ minWidth: 250 }}
            value={kindValue}
            onChange={(_, kind) => setKind(kind?.value || null)}
            options={filteredStartData.kinds}
            renderInput={(params) => <TextField {...params} label={<Trans>Kinds</Trans>} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
          <Stack spacing={1} direction="row">
            <Box>
              <Divider orientation="vertical" />
            </Box>
            <Stack spacing={1} flexGrow={1}>
              {config.map((item, i) => (
                <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback} key={item.id}>
                  <InventoryFormFilterRow item={item} index={i} setConfig={setConfig} kind={kind} preItems={filteredStartData} />
                </NetworkErrorBoundary>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
