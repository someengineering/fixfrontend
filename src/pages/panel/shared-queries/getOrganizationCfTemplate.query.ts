import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetOrganizationCfTemplateResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getOrganizationCfTemplateQuery = ({
  signal,
  queryKey: [_, organizationId],
}: QueryFunctionContext<['organization-cf-template', string | undefined]>) => {
  return organizationId
    ? axiosWithAuth
        .get<GetOrganizationCfTemplateResponse>(endPoints.organizations.cf_template(organizationId), { signal })
        .then((res) => res.data)
    : undefined
}
