import { Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventorySearchStartQuery } from 'src/pages/panel/shared/queries'
import { DefaultPropertiesKeys, Predicate, useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormAccount } from './InventoryFormAccount'
import { InventoryFormChanges } from './InventoryFormChanges'
import { InventoryFormCloud } from './InventoryFormCloud'
import { InventoryFormFullTextSearches } from './InventoryFormFullTextSearch'
import { InventoryFormKind } from './InventoryFormKind'
import { InventoryFormMore } from './InventoryFormMore'
import { InventoryFormRegion } from './InventoryFormRegion'
import { InventoryFormReset } from './InventoryFormReset'
import { InventoryFormRest } from './InventoryFormRest'
import { InventoryFormSeverity } from './InventoryFormSeverity'
import { inventorySendToGTM } from './utils'

export const InventoryForm = () => {
  const { account: selectedAccount, cloud: selectedCloud, region: selectedRegion, is } = useFixQueryParser()
  const selectedKind = is()
  const { selectedWorkspace } = useUserProfile()
  const { data: originalStartData, error } = useQuery({
    queryKey: ['workspace-inventory-search-start', selectedWorkspace?.id],
    queryFn: getWorkspaceInventorySearchStartQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id,
  })
  useEffect(() => {
    if (error) {
      inventorySendToGTM('getWorkspaceInventorySearchStartQuery', false, error as AxiosError, '')
    }
  }, [error])
  const startData = useMemo(() => originalStartData ?? { accounts: [], kinds: [], regions: [], severity: [] }, [originalStartData])
  const processedStartData = useMemo(() => {
    const clouds: string[] = []
    const biggestLength = Math.max(startData.accounts.length, startData.kinds.length, startData.regions.length)
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
    const possibleValues = [DefaultPropertiesKeys.Cloud, DefaultPropertiesKeys.Account, DefaultPropertiesKeys.Region]
    const result: string[] = []
    const config = [selectedCloud, selectedAccount, selectedRegion]
    for (let index = 0; index < config.length; index++) {
      const currentConfig = config[index]
      if (currentConfig instanceof Predicate) {
        const path = currentConfig.path.toString() as DefaultPropertiesKeys
        if (possibleValues.includes(path) && currentConfig.value) {
          let propertyIndex: '' | 'accounts' | 'regions' = ''
          const configValue = currentConfig.value

          switch (path) {
            case DefaultPropertiesKeys.Account:
              propertyIndex = 'accounts'
              break
            case DefaultPropertiesKeys.Region:
              propertyIndex = 'regions'
              break
          }
          if (currentConfig.op === '!=' && typeof configValue === 'string') {
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => name !== configValue).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => cloud !== configValue)),
            )
          } else if (currentConfig.op === '=' && typeof configValue === 'string') {
            result.push(
              propertyIndex ? processedStartData[propertyIndex].find(({ name }) => name === configValue)?.cloud ?? '' : configValue,
            )
          } else if ((currentConfig.op === 'in' || currentConfig.op === 'not in') && Array.isArray(configValue)) {
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => (configValue as string[]).includes(name)).map(({ cloud }) => cloud)
                : (configValue as string[])),
            )
          } else if (currentConfig.op === '~' && typeof configValue === 'string') {
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => name.match(configValue)).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => cloud.match(configValue))),
            )
          } else if (currentConfig.op === '!~' && typeof configValue === 'string') {
            result.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => !name.match(configValue)).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => !cloud.match(configValue))),
            )
          }
        }
      }
    }
    const selectedKindCloud = processedStartData.kinds.filter(({ id }) => selectedKind?.kinds.includes(id)).map(({ cloud }) => cloud)
    if (selectedKindCloud.length) {
      result.push(...selectedKindCloud)
    }
    return [...new Set(result.filter((cloud) => cloud))]
  }, [processedStartData, selectedAccount, selectedCloud, selectedKind, selectedRegion])
  const filteredStartData = useMemo(
    () => ({
      accounts: (selectedClouds.length
        ? processedStartData.accounts.filter((account) => selectedClouds.includes(account.cloud))
        : processedStartData.accounts
      ).map((account) => ({ value: account.name, label: account.name })),
      kinds: (selectedClouds.length
        ? processedStartData.kinds.filter((kind) => selectedClouds.includes(kind.cloud))
        : processedStartData.kinds
      ).map((kind) => ({ value: kind.id, label: kind.name })),
      regions: (selectedClouds.length
        ? processedStartData.regions.filter((region) => selectedClouds.includes(region.cloud))
        : processedStartData.regions
      ).map((region) => ({ value: region.name, label: region.name })),
      severities: processedStartData.severity.map((severity) => ({ label: severity, value: severity })),
      clouds: selectedClouds.length
        ? selectedClouds.map((cloud) => ({ label: cloud.toUpperCase(), value: cloud }))
        : processedStartData.clouds.map((cloud) => ({ label: cloud.toUpperCase(), value: cloud })),
    }),
    [processedStartData, selectedClouds],
  )
  return (
    <Stack direction="row" width="100%" flexWrap="wrap" overflow="auto" py={1}>
      <InventoryFormReset />
      <InventoryFormChanges />
      <InventoryFormFullTextSearches />
      <InventoryFormKind preItems={filteredStartData} />
      <InventoryFormCloud preItems={filteredStartData} />
      <InventoryFormAccount preItems={filteredStartData} />
      <InventoryFormRegion preItems={filteredStartData} />
      <InventoryFormSeverity preItems={filteredStartData} />
      <InventoryFormRest preItems={filteredStartData} />
      <InventoryFormMore preItems={filteredStartData} />
    </Stack>
  )
}
