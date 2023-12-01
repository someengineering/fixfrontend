import { Trans } from '@lingui/macro'
import { Autocomplete, Box, Divider, Grid, Stack, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { DefaultPropertiesKeys } from 'src/pages/panel/shared/constants'
import { getWorkspaceInventorySearchStartQuery } from 'src/pages/panel/shared/queries'
import { isValidProp } from 'src/pages/panel/shared/utils'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { InventoryAdvanceSearchConfig } from './InventoryAdvanceSearch'
import { InventoryFormFilterRow } from './InventoryFormFilterRow'
import { InventoryFormTemplateObject, InventoryFormTemplates } from './InventoryFormTemplates'
import { getArrayFromInOP } from './utils'

interface InventoryFormProps {
  setConfig: Dispatch<SetStateAction<InventoryAdvanceSearchConfig[]>>
  searchCrit: string
  kind: string | null
  setKind: (kind: string | null) => void
  config: InventoryAdvanceSearchConfig[]
}

export const InventoryForm = ({ searchCrit, kind, setKind, config, setConfig }: InventoryFormProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data: originalStartData } = useQuery({
    queryKey: ['workspace-inventory-search-start', selectedWorkspace?.id],
    queryFn: getWorkspaceInventorySearchStartQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id,
  })
  const startData = useMemo(() => originalStartData ?? { accounts: [], kinds: [], regions: [], severity: [] }, [originalStartData])
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
    const possibleValues = [DefaultPropertiesKeys.Cloud, DefaultPropertiesKeys.Account, DefaultPropertiesKeys.Regions]
    const result: string[] = []
    for (let index = 0; index < config.length; index++) {
      const currentConfig = config[index]
      if (typeof currentConfig !== 'string' && currentConfig) {
        if (possibleValues.includes(currentConfig.property as DefaultPropertiesKeys) && currentConfig.value) {
          let propertyIndex: '' | 'accounts' | 'regions' = ''
          const configValue = currentConfig.value

          switch (currentConfig.property as DefaultPropertiesKeys) {
            case DefaultPropertiesKeys.Account:
              propertyIndex = 'accounts'
              break
            case DefaultPropertiesKeys.Regions:
              propertyIndex = 'regions'
              break
          }
          if (currentConfig.op === '!=') {
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ id }) => id !== configValue).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => cloud !== configValue)),
            )
          } else if (currentConfig.op === '=') {
            result.push(propertyIndex ? processedStartData[propertyIndex].find(({ id }) => id === configValue)?.cloud ?? '' : configValue)
          } else if (currentConfig.op === 'in') {
            const configValues = getArrayFromInOP(configValue)
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ id }) => configValues.includes(id)).map(({ cloud }) => cloud)
                : configValues),
            )
          } else if (currentConfig.op === '~') {
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ id }) => id.match(configValue)).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => cloud.match(configValue))),
            )
          } else if (currentConfig.op === '!~') {
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ id }) => !id.match(configValue)).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => !cloud.match(configValue))),
            )
          }
        }
      }
    }
    const selectedKindCloud = processedStartData.kinds.find((i) => i.id === kind)?.cloud
    if (selectedKindCloud) {
      result.push(selectedKindCloud)
    }
    return [...new Set(result.filter((cloud) => cloud))]
  }, [config, processedStartData, kind])
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
      clouds: selectedClouds.length
        ? selectedClouds.map((cloud) => ({ label: cloud.toUpperCase(), value: cloud }))
        : processedStartData.clouds.map((cloud) => ({ label: cloud.toUpperCase(), value: cloud })),
    }),
    [processedStartData, selectedClouds],
  )
  const kindValue = kind ? filteredStartData.kinds.find((i) => i.value === kind) ?? null : null
  const handleAddTemplate = ({ selectAccount, selectCloud, selectRegion, selectSeverity, selectTag }: InventoryFormTemplateObject) => {
    setConfig((prev) => {
      const newValue = !prev[prev.length - 1].property ? prev.slice(0, prev.length - 1) : [...prev]
      if (selectAccount) {
        newValue.push({
          id: Math.random(),
          property: '/ancestors.account.reported.id',
          op: '=',
          value: selectAccount,
          fqn: 'string',
        })
      }
      if (selectCloud) {
        newValue.push({
          id: Math.random(),
          property: '/ancestors.cloud.reported.id',
          op: '=',
          value: selectCloud,
          fqn: 'string',
        })
      }
      if (selectRegion) {
        newValue.push({
          id: Math.random(),
          property: '/ancestors.region.reported.id',
          op: '=',
          value: selectRegion,
          fqn: 'string',
        })
      }
      if (selectSeverity) {
        newValue.push({
          id: Math.random(),
          property: '/security.severity',
          op: 'in',
          value: selectSeverity,
          fqn: 'string',
        })
      }
      if (selectTag) {
        newValue.push({
          id: Math.random(),
          property: `tags.${isValidProp(selectTag) ? selectTag : `\`${selectTag}\``}`,
          op: '=',
          value: null,
          fqn: 'string',
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
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Autocomplete
            size="small"
            disablePortal
            value={kindValue}
            onChange={(_, kind) => setKind(kind?.value || null)}
            options={filteredStartData.kinds}
            renderInput={(params) => <TextField {...params} label={<Trans>Kinds</Trans>} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={9} lg={10}>
          <Stack spacing={1} direction="row">
            <Box>
              <Divider orientation="vertical" />
            </Box>
            <Stack spacing={1} flexGrow={1}>
              {config.map((item) => (
                <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback} key={item.id}>
                  <InventoryFormFilterRow
                    item={item}
                    id={item.id}
                    setConfig={setConfig}
                    showDelete={!!kind || config.length > 1}
                    kind={kind}
                    setKind={setKind}
                    preItems={filteredStartData}
                    searchCrit={searchCrit}
                  />
                </NetworkErrorBoundary>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
