import { Box, BoxProps } from '@mui/material'
import { ReactNode } from 'react'

export type TabType<TabKeyType extends number | string | undefined = undefined> = {
  title: ReactNode
  content: ReactNode
  props?: BoxProps
} & (TabKeyType extends undefined ? { id?: never } : { id: TabKeyType })

type TabPanelProps<TabKeyType extends number | string | undefined = undefined> = Exclude<TabType<TabKeyType>, 'id'> & {
  index: number
  id: TabKeyType
  value: TabKeyType extends undefined ? number : TabKeyType
}

export function TabPanel<TabKeyType extends number | string | undefined = undefined>({
  content,
  id,
  props,
  index,
  value,
}: TabPanelProps<TabKeyType>) {
  const currentId = id ?? index
  return (
    <Box
      role="tabpanel"
      hidden={value !== currentId}
      id={`simple-tabpanel-${currentId}`}
      aria-labelledby={`simple-tab-${currentId}`}
      {...props}
    >
      {value === currentId ? content : null}
    </Box>
  )
}
