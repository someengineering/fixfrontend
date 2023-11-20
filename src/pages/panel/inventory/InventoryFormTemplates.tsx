import { Autocomplete, Grid, ListItemButton, Typography } from '@mui/material'
import { DefaultPropertiesKeys } from 'src/pages/panel/shared/constants'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { InventoryTagAutoComplete } from './InventoryTagAutoComplete'
import { AutoCompletePreDefinedItems, getAutoCompletePropsFromKey } from './utils'

export interface InventoryFormTemplateObject {
  selectCloud?: string
  selectAccount?: string
  selectRegion?: string
  selectSeverity?: string
  selectTag?: string
}

interface InventoryFormTemplatesProps {
  addTemplate: (config: InventoryFormTemplateObject) => void
  startData: AutoCompletePreDefinedItems
  searchCrit: string
}

export const InventoryFormTemplates = ({ addTemplate, startData, searchCrit }: InventoryFormTemplatesProps) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Autocomplete
          {...getAutoCompletePropsFromKey(DefaultPropertiesKeys.Cloud)}
          size="small"
          disablePortal
          fullWidth
          onChange={(_, cloud) => cloud && addTemplate({ selectCloud: cloud.value })}
          value={null}
          options={startData.clouds}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Autocomplete
          {...getAutoCompletePropsFromKey(DefaultPropertiesKeys.Account)}
          size="small"
          disablePortal
          fullWidth
          onChange={(_, account) => account && addTemplate({ selectAccount: account.value })}
          value={null}
          options={startData.accounts}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Autocomplete
          {...getAutoCompletePropsFromKey(DefaultPropertiesKeys.Regions)}
          size="small"
          disablePortal
          fullWidth
          onChange={(_, region) => region && addTemplate({ selectRegion: region.value })}
          value={null}
          options={startData.regions}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InventoryTagAutoComplete searchCrit={searchCrit} setSelectedTag={(selectTag) => addTemplate({ selectTag })} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Autocomplete
          {...getAutoCompletePropsFromKey(DefaultPropertiesKeys.Severity)}
          size="small"
          renderOption={(props, option, { inputValue: _, ...state }) =>
            option ? (
              <ListItemButton
                component="li"
                {...props}
                {...state}
                sx={{
                  '&:hover ~ &': {
                    textDecoration: 'none',
                    bgcolor: 'action.hover',
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                      backgroundColor: 'transparent',
                    },
                  },
                }}
              >
                <Typography color={getColorBySeverity(option.label)}>{option.label}</Typography>
              </ListItemButton>
            ) : (
              ''
            )
          }
          disablePortal
          fullWidth
          onChange={(_, severity) =>
            severity &&
            addTemplate({
              selectSeverity: `[${startData.severities
                .slice(startData.severities.findIndex((item) => item.label === severity.label) ?? startData.severities.length)
                .map((item) => item.label)
                .join(',')}]`,
            })
          }
          value={null}
          options={startData.severities}
        />
      </Grid>
    </Grid>
  )
}
