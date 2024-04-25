import { Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventorySearchStartQuery } from 'src/pages/panel/shared/queries'
import { InventoryFormAccount } from './InventoryFormAccount'
import { InventoryFormChanges } from './InventoryFormChanges'
import { InventoryFormCloud } from './InventoryFormCloud'
import { InventoryFormFullTextSearches } from './InventoryFormFullTextSearch'
import { InventoryFormKind } from './InventoryFormKind'
import { InventoryFormMore } from './InventoryFormMore'
import { InventoryFormRegion } from './InventoryFormRegion'
import { InventoryFormRest } from './InventoryFormRest'
import { InventoryFormSeverity } from './InventoryFormSeverity'
import { inventorySendToGTM } from './utils'

export const InventoryForm = () => {
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
  const filteredStartData = useMemo(
    () => ({
      accounts: Array.from(
        new Set(
          processedStartData.accounts.map((account) => ({
            value: account.name,
            label: account.name,
          })),
        ),
      ),
      kinds: Array.from(
        new Set(
          processedStartData.kinds.map((kind) => ({
            value: kind.id,
            label: kind.name,
          })),
        ),
      ),
      regions: Array.from(
        new Set(
          processedStartData.regions.map((region) => ({
            value: region.name,
            label: region.name,
          })),
        ),
      ),
      severities: processedStartData.severity.map((severity) => ({ label: severity, value: severity })),
      clouds: processedStartData.clouds.map((cloud) => ({ label: cloud.toUpperCase(), value: cloud })),
    }),
    [processedStartData],
  )
  return (
    <Stack direction="row" width="100%" component="form" flexWrap="wrap" overflow="auto">
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
