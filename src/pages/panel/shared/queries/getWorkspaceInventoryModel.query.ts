import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryModelResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryModelQuery = ({
  signal,
  queryKey: [
    ,
    workspaceId,
    kind,
    with_bases,
    with_property_kinds,
    aggregate_roots_only,
    with_properties,
    with_relatives,
    with_metadata,
    flat,
  ],
}: QueryFunctionContext<
  [
    'workspace-inventory-model',
    string | undefined, // workspaceId
    string | undefined, // kind
    boolean | undefined, // with_bases
    boolean | undefined, // with_property_kinds
    boolean | undefined, // aggregate_roots_only
    boolean | undefined, // with_properties
    boolean | undefined, // with_relatives
    boolean | undefined, // with_metadata
    boolean | undefined, // flat
  ]
>) => {
  const params: {
    kind?: string
    with_bases?: boolean
    with_property_kinds?: boolean
    aggregate_roots_only?: boolean
    with_properties?: boolean
    with_relatives?: boolean
    with_metadata?: boolean
    flat?: boolean
  } = {}
  if (kind !== undefined) {
    params.kind = kind
  }
  if (with_bases !== undefined) {
    params.with_bases = with_bases
  }
  if (with_property_kinds !== undefined) {
    params.with_property_kinds = with_property_kinds
  }
  if (aggregate_roots_only !== undefined) {
    params.aggregate_roots_only = aggregate_roots_only
  }
  if (with_properties !== undefined) {
    params.with_properties = with_properties
  }
  if (with_relatives !== undefined) {
    params.with_relatives = with_relatives
  }
  if (with_metadata !== undefined) {
    params.with_metadata = with_metadata
  }
  if (flat !== undefined) {
    params.flat = flat
  }
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryModelResponse>(endPoints.workspaces.workspace(workspaceId).inventory.model, {
          signal,
          params,
        })
        .then((res) => res.data)
    : ([] as GetWorkspaceInventoryModelResponse)
}
