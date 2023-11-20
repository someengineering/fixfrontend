import { QueryClient } from '@tanstack/react-query'
import { Account, GetWorkspaceCloudAccountsResponse, GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { getAccountName } from 'src/shared/utils/getAccountName'

export const replaceRowByAccount = (queryClient: QueryClient, id?: string) => {
  return (data: Account) => {
    if (data) {
      queryClient.setQueryData(['workspace-cloud-accounts', id], (oldData: GetWorkspaceCloudAccountsResponse) => {
        const foundIndex = oldData.findIndex((item) => item.id === data.id)
        if (foundIndex > -1) {
          const newData = [...oldData]
          newData[foundIndex] = data
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
