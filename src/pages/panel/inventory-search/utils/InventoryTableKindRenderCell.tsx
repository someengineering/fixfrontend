import { Box, Stack, Typography } from '@mui/material'
import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useThemeMode } from 'src/core/theme'
import { groupToColor } from 'src/shared/charts'

interface InventoryTableKindRenderCellProps {
  name: string
  iconUrl?: string
  group?: string
}

const getIcon = ({
  signal,
  queryKey: [, url, fill = '#ffffff'],
}: QueryFunctionContext<['icon', string | undefined, string | undefined]>) =>
  url
    ? axios
        .get<string>(url, { headers: { Accept: 'image/svg' }, signal })
        .then((res) => {
          try {
            if (res.data.startsWith('<svg')) {
              const svgWithColor = res.data.replace(/fill=("|')#fff("|')/g, `fill=$1${fill}$2`)
              return window.btoa(svgWithColor)
            }
          } catch {
            /* empty */
          }
          return null
        })
        .catch(() => null)
    : null

export const InventoryTableKindRenderCell = ({ group, iconUrl, name }: InventoryTableKindRenderCellProps) => {
  const defaultColor = useThemeMode().mode === 'dark' ? '#ffffff' : '#000000'
  const fill = group ? groupToColor(defaultColor, group) : defaultColor
  const { data: svg } = useQuery({
    queryFn: getIcon,
    queryKey: ['icon', iconUrl, fill],
    enabled: !!iconUrl,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
  })
  return (
    <Stack direction="row" spacing={1} alignItems="center" height="100%">
      {svg ? (
        <Box component="img" width={24} height={24} src={`data:image/svg+xml;base64,${svg}`} alt={name} />
      ) : svg === null ? (
        <Box component="img" width={24} height={24} src={iconUrl} alt={name} />
      ) : undefined}
      <Typography component="span" variant="caption" overflow="hidden" textOverflow="ellipsis" title={name}>
        {name}
      </Typography>
    </Stack>
  )
}
