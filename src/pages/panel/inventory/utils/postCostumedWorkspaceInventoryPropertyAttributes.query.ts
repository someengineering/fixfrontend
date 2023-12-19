import { QueryFunctionContext } from '@tanstack/react-query'
import { postWorkspaceInventoryPropertyAttributesQuery } from 'src/pages/panel/shared/queries'

export const postCostumedWorkspaceInventoryPropertyAttributesQuery = async ({
  signal,
  queryKey: [, workspaceId, path, prop, kind, type],
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
    (await postWorkspaceInventoryPropertyAttributesQuery({
      signal,
      queryKey: [
        'workspace-inventory-property-attributes',
        workspaceId,
        kind ? `is(${kind})` : 'all',
        `${path.split('.').slice(-1)[0]}${prop ? `=~"${prop.replace(/․/g, '.')}"` : ''}`,
      ] as const,
      pageParam,
      direction,
      meta,
    })?.then((item) =>
      item.map((key) => ({
        label: path ? `${path}.${key.replace(/\./g, '․')}` : key.replace(/\./g, '․'),
        key: key,
        value: type,
      })),
    )) ?? null
  if (type === 'string' && pageParam.skip === 0 && !data?.find((i) => i.key === prop)) {
    return (data ?? []).concat([{ label: path ? `${path}.${prop.replace(/\./g, '․')}` : prop.replace(/\./g, '․'), key: prop, value: type }])
  } else {
    return data
  }
}
