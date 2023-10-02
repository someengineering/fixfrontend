import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetExternalIdResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getExternalIdQuery = ({
  signal,
  queryKey: [_, organizationId],
}: QueryFunctionContext<['organization-external-id', string | undefined]>) => {
  return organizationId
    ? axiosWithAuth
        .get<GetExternalIdResponse>(endPoints.organizations.externalId(organizationId), { signal })
        .then((res) => res.data.external_id)
    : undefined
}
