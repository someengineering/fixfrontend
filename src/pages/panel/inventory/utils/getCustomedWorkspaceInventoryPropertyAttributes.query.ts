import { QueryFunctionContext } from '@tanstack/react-query'
import { getWorkspaceInventoryPropertyAttributesQuery } from 'src/pages/panel/shared/queries'

export const getCustomedWorkspaceInventoryPropertyAttributesQuery = async ({
  signal,
  queryKey: [_, workspaceId, path, prop, kind, type],
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
    string, // type
  ],
  {
    skip: number | null
    limit: number | null
  }
>) => {
  const data =
    (await getWorkspaceInventoryPropertyAttributesQuery({
      signal,
      queryKey: [
        'workspace-inventory-property-attributes',
        workspaceId,
        kind ? `is(${kind})` : 'all',
        `${path.split('.').slice(-1)[0]}${prop ? `=~${prop}` : ''}`,
      ] as const,
      pageParam,
      direction,
      meta,
    })?.then((item) => item.map((key) => ({ label: path ? `${path}.${key}` : key, key, value: type })))) ?? null
  if (type === 'string') {
    return (data ?? []).concat([{ label: path ? `${path}.${prop}` : prop, key: prop, value: type }])
  } else {
    return data
  }
}
