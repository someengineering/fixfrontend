import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetOrganizationCfUrlResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getOrganizationCfUrlQuery = ({
  signal,
  queryKey: [_, organizationId],
}: QueryFunctionContext<['organization-cf-url', string | undefined]>) => {
  return organizationId
    ? axiosWithAuth.get<GetOrganizationCfUrlResponse>(endPoints.organizations.cf_url(organizationId), { signal }).then((res) => res.data)
    : undefined
}
