import { QueryClient } from '@tanstack/react-query'
import { Account, GetWorkspaceCloudAccountsResponse, GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { getAccountName } from 'src/shared/utils/getAccountName'

export const replaceRowByAccount = (queryClient: QueryClient, id?: string) => {
  return (data: Account) => {
    if (data) {
      queryClient.setQueryData(['workspace-cloud-accounts', id], (oldData: GetWorkspaceCloudAccountsResponse) => {
        const foundAddedIndex = oldData.added.findIndex((item) => item.id === data.id)
        const newData = { ...oldData }
        if (foundAddedIndex > -1) {
          const newAccounts = [...oldData.added]
          newAccounts[foundAddedIndex] = data
          newData.added = newAccounts
        }
        const foundRecentIndex = oldData.recent.findIndex((item) => item.id === data.id)
        if (foundRecentIndex > -1) {
          const newAccounts = [...oldData.recent]
          newAccounts[foundRecentIndex] = data
          newData.recent = newAccounts
        }
        const foundDiscoveredIndex = oldData.discovered.findIndex((item) => item.id === data.id)
        if (foundDiscoveredIndex > -1) {
          const newAccounts = [...oldData.discovered]
          newAccounts[foundDiscoveredIndex] = data
          newData.discovered = newAccounts
        }

        if (foundAddedIndex > -1 || foundRecentIndex > -1 || foundDiscoveredIndex > -1) {
          return newData
        }

        return oldData
      })
      queryClient.setQueryData(['workspace-report-summary', id], (oldData: GetWorkspaceInventoryReportSummaryResponse) => {
        const foundIndex = oldData.accounts.findIndex((item) => item.id === data.account_id)
        if (foundIndex > -1) {
          const newData = { ...oldData }
          newData.accounts = [...oldData.accounts]
          newData.accounts[foundIndex] = {
            ...oldData.accounts[foundIndex],
            name: getAccountName(data) ?? '',
          }
          return newData
        }
        return oldData
      })
    }
  }
}
