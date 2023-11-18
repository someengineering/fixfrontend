import { QueryFunctionContext } from '@tanstack/react-query'
import { getWorkspaceInventoryPropertyAttributesQuery } from 'src/pages/panel/shared/queries'

export const getCustomedWorkspaceInventoryPropertyAttributesQuery = ({
  signal,
  queryKey: [_, workspaceId, path, prop, kind],
  pageParam,
  direction,
  meta,
}: QueryFunctionContext<
  readonly [
    'workspace-inventory-property-path-complete-query',
    string | undefined, // workspaceId
    string, // path
    string, // prop
    string | null, // kind
  ],
  {
    skip: number | null
    limit: number | null
  }
>) => {
  return (
    getWorkspaceInventoryPropertyAttributesQuery({
      signal,
      queryKey: [
        'workspace-inventory-property-attributes',
        workspaceId,
        kind ? `is(${kind})` : 'all',
        path.split('.').slice(-1)[0],
      ] as const,
      pageParam,
      direction,
      meta,
    })?.then((item) => item.map((key) => ({ label: path ? `${path}.${key}` : key, key, value: prop }))) ?? null
  )
}
