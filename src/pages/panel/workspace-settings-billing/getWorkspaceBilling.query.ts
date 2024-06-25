import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceBillingResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceBillingQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-billing', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceBillingResponse>(endPoints.workspaces.workspace(workspaceId).billing, { signal })
        .then((res) => res.data)
    : ({
        available_payment_methods: [],
        product_tier: 'Free',
        selected_product_tier: 'Free',
        workspace_payment_method: { method: 'none' },
      } as GetWorkspaceBillingResponse)
}
