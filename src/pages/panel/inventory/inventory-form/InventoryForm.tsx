import { Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventorySearchStartQuery } from 'src/pages/panel/shared/queries'
import { sendInventoryError } from 'src/pages/panel/shared/utils'
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

function removeStringDuplicates(data?: string[]) {
  return data ? Array.from(new Set(data)) : []
}

function removeDuplicates<T>(data?: T[], basedOn?: keyof T) {
  return data
    ? Array.from(new Set(data.map((i) => JSON.stringify(basedOn ? i[basedOn] : i)))).map((i) => {
        const result = JSON.parse(i) as unknown
        if (basedOn) {
          return data.find((i) => i[basedOn] === result)!
        }
        return result as T
      })
    : []
}

export const InventoryForm = () => {
  const postHog = usePostHog()
  const { account: selectedAccount, cloud: selectedCloud, region: selectedRegion, is: selectedKinds } = useFixQueryParser()
  const { currentUser, selectedWorkspace } = useUserProfile()
  const { data: originalStartData, error } = useQuery({
    queryKey: ['workspace-inventory-search-start', selectedWorkspace?.id],
    queryFn: getWorkspaceInventorySearchStartQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id,
  })
  useEffect(() => {
    if (error) {
      sendInventoryError({
        currentUser,
        workspaceId: selectedWorkspace?.id,
        queryFn: 'getWorkspaceInventorySearchStartQuery',
        isAdvancedSearch: false,
        error: error as AxiosError,
        postHog,
      })
    }
  }, [currentUser, error, postHog, selectedWorkspace?.id])
  const startData = useMemo(
    () =>
      originalStartData
        ? {
            accounts: removeDuplicates(originalStartData.accounts, 'name'),
            kinds: removeDuplicates(originalStartData.kinds, 'name'),
            regions: removeDuplicates(originalStartData.regions, 'name'),
            severity: removeStringDuplicates(originalStartData.severity),
          }
        : { accounts: [], kinds: [], regions: [], severity: [] },
    [originalStartData],
  )
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
  const preDefinedFiltersSelectedClouds = useMemo(() => {
    const possibleValues = [
      DefaultPropertiesKeys.CloudId,
      DefaultPropertiesKeys.Cloud,
      DefaultPropertiesKeys.AccountId,
      DefaultPropertiesKeys.Account,
      DefaultPropertiesKeys.RegionId,
      DefaultPropertiesKeys.Region,
    ]
    const result: string[][] = []
    const config = [selectedCloud, selectedAccount, selectedRegion]
    for (let index = 0; index < config.length; index++) {
      const currentResult = []
      const currentConfig = config[index]
      if (currentConfig instanceof Predicate) {
        const path = currentConfig.path.toString() as DefaultPropertiesKeys
        if (possibleValues.includes(path) && currentConfig.value) {
          let propertyIndex: '' | 'accounts' | 'regions' = ''
          const configValue = currentConfig.value

          switch (path) {
            case DefaultPropertiesKeys.AccountId:
            case DefaultPropertiesKeys.Account:
              propertyIndex = 'accounts'
              break
            case DefaultPropertiesKeys.RegionId:
            case DefaultPropertiesKeys.Region:
              propertyIndex = 'regions'
              break
          }
          if (currentConfig.op === '!=' && typeof configValue === 'string') {
            currentResult.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => name !== configValue).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => cloud !== configValue)),
            )
          } else if (currentConfig.op === '=' && typeof configValue === 'string') {
            currentResult.push(
              propertyIndex ? processedStartData[propertyIndex].find(({ name }) => name === configValue)?.cloud ?? '' : configValue,
            )
          } else if ((currentConfig.op === 'in' || currentConfig.op === 'not in') && Array.isArray(configValue)) {
            currentResult.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => (configValue as string[]).includes(name)).map(({ cloud }) => cloud)
                : (configValue as string[])),
            )
          } else if (currentConfig.op === '~' && typeof configValue === 'string') {
            currentResult.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => name.match(configValue)).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => cloud.match(configValue))),
            )
          } else if (currentConfig.op === '!~' && typeof configValue === 'string') {
            currentResult.push(
              ...(propertyIndex
                ? processedStartData[propertyIndex].filter(({ name }) => !name.match(configValue)).map(({ cloud }) => cloud)
                : processedStartData.clouds.filter((cloud) => !cloud.match(configValue))),
            )
          }
        }
      }
      result.push(currentResult.filter((cloud) => cloud))
    }
    const selectedKindCloud = processedStartData.kinds.filter(({ id }) => selectedKinds?.kinds.includes(id)).map(({ cloud }) => cloud)
    if (selectedKindCloud.length) {
      result.push(selectedKindCloud)
    }
    return result
  }, [processedStartData, selectedAccount, selectedCloud, selectedKinds?.kinds, selectedRegion])
  const selectedClouds = useMemo(() => {
    return Array.from(new Set(preDefinedFiltersSelectedClouds.flat()))
  }, [preDefinedFiltersSelectedClouds])
  const numberOfCloudFilterSelected = preDefinedFiltersSelectedClouds[0].length
  const numberOfCloudSelected = preDefinedFiltersSelectedClouds.reduce((sum, cloud, index) => (!index ? sum : sum + cloud.length), 0)
  const filteredStartData = useMemo(
    () => ({
      accounts: (selectedClouds.length
        ? processedStartData.accounts.filter((account) => selectedClouds.includes(account.cloud))
        : processedStartData.accounts
      ).map((account) => ({ value: account.name, label: account.name, id: account.id })),
      kinds: (selectedClouds.length
        ? processedStartData.kinds.filter((kind) => selectedClouds.includes(kind.cloud))
        : processedStartData.kinds
      ).map((kind) => ({ value: kind.id, label: kind.name, id: kind.id })),
      regions: (selectedClouds.length
        ? processedStartData.regions.filter((region) => selectedClouds.includes(region.cloud))
        : processedStartData.regions
      ).map((region) => ({ value: region.name, label: region.name, id: region.id })),
      severities: processedStartData.severity.map((severity) => ({ label: severity, value: severity, id: severity })),
      clouds:
        (!numberOfCloudFilterSelected && selectedClouds.length) || (numberOfCloudFilterSelected && numberOfCloudSelected)
          ? selectedClouds.map((cloud) => ({ label: cloud.toUpperCase(), value: cloud, id: cloud }))
          : processedStartData.clouds.map((cloud) => ({ value: cloud, label: cloud.toUpperCase(), id: cloud })),
    }),
    [processedStartData, selectedClouds, numberOfCloudFilterSelected, numberOfCloudSelected],
  )
  return (
    <Stack direction="row" width="100%" flexWrap="wrap" gap={1} overflow="auto" py={1}>
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
