import { GenericServerError } from 'src/shared/types/server-shared'

export type PutWorkspaceCloudAccountGCPKeyResponse = undefined

export type PutWorkspaceCloudAccountGCPKeyRequest = {
  file: File
}

export type PutWorkspaceCloudAccountGCPKeyErrorResponse = GenericServerError<[[400, ['invalid_json']], [422, [string]]]>
