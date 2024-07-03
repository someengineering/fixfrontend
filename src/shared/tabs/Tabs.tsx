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
  value?: TabKeyType extends undefined ? number : TabKeyType
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

function UnControlledTabs<TabKeyType extends number | string | undefined = undefined>({
  tabs,
  defaultTab,
  a11yProps = defaultA11yProps,
  containerProps,
  onChange,
  tabsProps,
}: Omit<TabsProps<TabKeyType>, 'value'>) {
  type CurrentTabKeyType = TabKeyType extends undefined ? number : TabKeyType
  const [value, setValue] = useState<CurrentTabKeyType>((defaultTab ?? 0) as CurrentTabKeyType)
  const handleChange = (_: unknown, newValue: CurrentTabKeyType) => {
    onChange?.(newValue)
    setValue(newValue)
  }
  return (
    <Box sx={{ width: '100%' }} {...containerProps}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} {...tabsProps}>
        <MuiTabs value={value} onChange={handleChange} aria-label={t`Automatic Cloud Setup`}>
          {tabs.map(({ title, id, props }, index) => (
            <Tab
              label={title}
              key={(id?.toString() ?? '') + index.toString()}
              {...a11yProps(typeof id === 'string' ? id : `tab-${index}`, typeof title === 'string' ? title : `tabpanel-${index}`)}
              {...props}
            />
          ))}
        </MuiTabs>
      </Box>
      {tabs.map((item, index) => (
        <TabPanel
          content={item.content}
          id={index}
          contentProps={item.contentProps}
          key={(item.id?.toString() ?? '') + index.toString()}
          index={index}
          value={value as number}
        />
      ))}
    </Box>
  )
}

function ControlledTabs<TabKeyType extends number | string | undefined = undefined>({
  tabs,
  value,
  a11yProps = defaultA11yProps,
  containerProps,
  onChange,
  tabsProps,
}: Omit<TabsProps<TabKeyType>, 'defaultTab'>) {
  type CurrentTabKeyType = TabKeyType extends undefined ? number : TabKeyType
  const handleChange = (_: unknown, newValue: CurrentTabKeyType) => {
    onChange?.(newValue)
  }
  const valueIndex = tabs.findIndex((item) => item.id === value) ?? 0
  return (
    <Box sx={{ width: '100%' }} {...containerProps}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} {...tabsProps}>
        <MuiTabs value={valueIndex} onChange={handleChange} aria-label={t`Automatic Cloud Setup`}>
          {tabs.map(({ title, id, props }, index) => (
            <Tab
              label={title}
              key={(id?.toString() ?? '') + index.toString()}
              {...a11yProps(typeof id === 'string' ? id : `tab-${index}`, typeof title === 'string' ? title : `tabpanel-${index}`)}
              {...props}
            />
          ))}
        </MuiTabs>
      </Box>
      {tabs.map((item, index) => (
        <TabPanel
          content={item.content}
          id={index}
          contentProps={item.contentProps}
          key={(item.id?.toString() ?? '') + index.toString()}
          index={index}
          value={value as number}
        />
      ))}
    </Box>
  )
}

export function Tabs<TabKeyType extends number | string | undefined = undefined>({ value, defaultTab, ...props }: TabsProps<TabKeyType>) {
  return value ? <ControlledTabs value={value} {...props} /> : <UnControlledTabs defaultTab={defaultTab} {...props} />
}
