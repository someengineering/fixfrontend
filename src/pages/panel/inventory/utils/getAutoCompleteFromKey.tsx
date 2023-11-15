import { Trans } from '@lingui/macro'
import { AutocompleteRenderInputParams, AutocompleteRenderOptionState, ListItemButton, TextField, Typography } from '@mui/material'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { getArrayFromInOP } from './getArrayFromInOP'

export interface AutoCompleteValue {
  value: string
  label: string
}

export interface AutoCompletePreDefinedItems {
  accounts: AutoCompleteValue[]
  kinds: AutoCompleteValue[]
  regions: AutoCompleteValue[]
  severities: AutoCompleteValue[]
  clouds: AutoCompleteValue[]
}

export const getAutocompleteValueFromKey = (key: string, items: AutoCompletePreDefinedItems, value: string | null, isArray?: boolean) => {
  if (!value || (isArray && value === '[]')) {
    return isArray ? [] : null
  }
  const data = getAutocompleteDataFromKey(key, items)
  return isArray ? getArrayFromInOP(value).map((item) => data.find((i) => i.value === item)) : data.find((i) => i.value === value)
}

export const getAutocompleteDataFromKey = (key: string, items: AutoCompletePreDefinedItems) => {
  switch (key) {
    case 'account':
      return items.accounts
    case 'cloud':
      return items.clouds
    case 'region':
      return items.regions
    case 'severity':
      return items.severities
    default:
      return [] as AutoCompleteValue[]
  }
}

export const getAutoCompletePropsFromKey = (key: string) => {
  switch (key) {
    case 'cloud':
      return {
        renderOption: (
          props: React.HTMLAttributes<HTMLLIElement>,
          option: AutoCompleteValue,
          { inputValue: _, ...state }: AutocompleteRenderOptionState,
        ) =>
          option ? (
            <ListItemButton component="li" {...props} {...state}>
              <CloudAvatar cloud={option.value} />
              <Typography variant="overline" ml={2}>
                {option.label}
              </Typography>
            </ListItemButton>
          ) : (
            ''
          ),
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Clouds</Trans>} />,
      }
    case 'account':
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Accounts</Trans>} />,
      }
    case 'region':
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Regions</Trans>} />,
      }
    case 'severity':
      return {
        renderOption: (
          props: React.HTMLAttributes<HTMLLIElement>,
          option: AutoCompleteValue,
          { inputValue: _, ...state }: AutocompleteRenderOptionState,
        ) =>
          option ? (
            <ListItemButton component="li" {...props} {...state}>
              <Typography color={getColorBySeverity(option.label)}>{option.label}</Typography>
            </ListItemButton>
          ) : (
            ''
          ),

        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Severity</Trans>} />,
      }
    default:
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Value</Trans>} />,
      }
  }
}
