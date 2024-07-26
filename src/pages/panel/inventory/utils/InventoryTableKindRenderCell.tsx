import { Box, Stack } from '@mui/material'
import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useThemeMode } from 'src/core/theme'
import { groupToColor } from 'src/shared/charts'
import { useNonce } from 'src/shared/providers'

interface InventoryTableKindRenderCellProps {
  name: string
  iconUrl?: string
  group?: string
}

const getIcon = ({ signal, queryKey: [, url] }: QueryFunctionContext<['icon', string | undefined]>) =>
  url
    ? axios
        .get<string>(url, { headers: { Accept: 'image/svg' }, signal })
        .then((res) => (res.data.startsWith('<svg') ? res.data.replace(/fill="#fff"/g, '') : null))
        .catch(() => null)
    : null

export const InventoryTableKindRenderCell = ({ group, iconUrl, name }: InventoryTableKindRenderCellProps) => {
  const nonce = useNonce()
  const { data: svg } = useQuery({
    queryFn: getIcon,
    queryKey: ['icon', iconUrl],
    enabled: !!iconUrl,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
  })
  const defaultColor = useThemeMode().mode === 'dark' ? '#fff' : '#000'
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {svg ? (
        <Box
          width={32}
          height={32}
          sx={{ fill: group ? groupToColor(defaultColor, group) : defaultColor }}
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : svg === null ? (
        <Box component="img" width={32} height={32} src={iconUrl} />
      ) : undefined}
      <span>{name}</span>
    </Stack>
  )
}
