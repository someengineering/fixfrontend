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
    kindFilter,
    withBases,
    withPropertyKinds,
    aggregateRootsOnly,
    withProperties,
    withRelatives,
    withMetadata,
    flat,
  ],
}: QueryFunctionContext<
  [
    'workspace-inventory-model',
    string | undefined, // workspaceId
    string | undefined, // kind
    string | undefined, // kind_filter
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
    kind_filter?: string[]
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
  if (kindFilter !== undefined) {
    params.kind_filter = kindFilter.split(',')
  }
  if (withBases !== undefined) {
    params.with_bases = withBases
  }
  if (withPropertyKinds !== undefined) {
    params.with_property_kinds = withPropertyKinds
  }
  if (aggregateRootsOnly !== undefined) {
    params.aggregate_roots_only = aggregateRootsOnly
  }
  if (withProperties !== undefined) {
    params.with_properties = withProperties
  }
  if (withRelatives !== undefined) {
    params.with_relatives = withRelatives
  }
  if (withMetadata !== undefined) {
    params.with_metadata = withMetadata
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
