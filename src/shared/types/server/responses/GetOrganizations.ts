export interface GetOrganizationResponse {
  id: string
  slug: string
  name: string
  owners: string[]
  members: unknown[]
}

export type GetOrganizationsResponse = GetOrganizationResponse[]
