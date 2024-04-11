import { t } from '@lingui/macro'
import { Box, BoxProps, Tabs as MuiTabs, Tab } from '@mui/material'
import { useState } from 'react'
import { TabPanel, TabType } from './TabPanel'

interface TabsA11Props {
  id: string
  'aria-controls': string
}

interface TabsProps<TabKeyType extends number | string | undefined = undefined> {
  tabs: TabType<TabKeyType>[]
  defaultTab?: TabKeyType extends undefined ? number : TabKeyType
  containerProps?: BoxProps
  tabsProps?: BoxProps
  a11yProps?: (id: string, title: string) => TabsA11Props
  onChange?: (id: TabKeyType extends undefined ? number : TabKeyType) => void
}

function defaultA11yProps(id: string, title: string) {
  return {
    id,
    'aria-controls': title,
  } as TabsA11Props
}

export function Tabs<TabKeyType extends number | string | undefined = undefined>({
  tabs,
  defaultTab,
  a11yProps = defaultA11yProps,
  containerProps,
  onChange,
  tabsProps,
}: TabsProps<TabKeyType>) {
  const [value, setValue] = useState<number>((defaultTab ? defaultTab : 0) as number)
  const handleChange = (_: unknown, newValue: number) => {
    onChange?.((tabs[newValue].id ?? newValue) as TabKeyType extends undefined ? number : TabKeyType)
    setValue(newValue)
  }
  return (
    <Box sx={{ width: '100%' }} {...containerProps}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} {...tabsProps}>
        <MuiTabs value={value} onChange={handleChange} aria-label={t`Automatic Cloud Setup`}>
          {tabs.map((item, index) => (
            <Tab
              label={item.title}
              key={(item.id?.toString() ?? '') + index.toString()}
              {...a11yProps(typeof item.id ?? `tab-${index}`, typeof item.title === 'string' ? item.title : `tabpanel-${index}`)}
            />
          ))}
        </MuiTabs>
      </Box>
      {tabs.map((item, index) => (
        <TabPanel
          content={item.content}
          id={index}
          title={item.title}
          props={item.props}
          key={(item.id?.toString() ?? '') + index.toString()}
          index={index}
          value={value}
        />
      ))}
    </Box>
  )
}
