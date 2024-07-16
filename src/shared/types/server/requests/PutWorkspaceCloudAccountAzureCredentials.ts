import { GenericServerError } from 'src/shared/types/server-shared'

export type PutWorkspaceCloudAccountAzureCredentialsResponse = undefined

export type PutWorkspaceCloudAccountAzureCredentialsRequest = {
  azure_tenant_id: string
  client_id: string
  client_secret: string
}

export type PutWorkspaceCloudAccountAzureCredentialsErrorResponse = GenericServerError<[[422, ['invalid_credentials']]]>
