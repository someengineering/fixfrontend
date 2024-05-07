import { Trans } from '@lingui/macro'
import { AutocompleteRenderInputParams, AutocompleteRenderOptionState, Divider, ListItemButton, TextField, Typography } from '@mui/material'
import { Fragment, HTMLAttributes } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { DefaultPropertiesKeys } from 'src/shared/fix-query-parser'
import { AutoCompleteValue } from 'src/shared/types/shared'

export interface AutoCompletePreDefinedItems {
  accounts: AutoCompleteValue[]
  kinds: AutoCompleteValue[]
  regions: AutoCompleteValue[]
  severities: AutoCompleteValue[]
  clouds: AutoCompleteValue[]
}

export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: '' | null,
  addThemIfNotFound?: boolean,
): null
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string,
  addThemIfNotFound: true,
): AutoCompleteValue
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string,
  addThemIfNotFound?: false,
): AutoCompleteValue | null
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: [] | [''] | null,
  addThemIfNotFound?: boolean,
): []
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: (string | null)[],
  addThemIfNotFound?: boolean,
): AutoCompleteValue[]
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string | (string | null)[] | null,
  addThemIfNotFound?: boolean,
): AutoCompleteValue | AutoCompleteValue[] | null
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string | (string | null)[] | null,
  addThemIfNotFound?: boolean,
) {
  const isArray = Array.isArray(value)
  if (!value && isArray) {
    return isArray ? [] : null
  }
  const data = getAutocompleteDataFromKey(key, items)
  return isArray
    ? ((value as string[])
        .map((item) => (data.find((i) => i.value === item) ?? addThemIfNotFound ? { value: item, label: item } : undefined))
        .filter((i) => i) as AutoCompleteValue[])
    : data.find((i) => i.value === value) || (addThemIfNotFound ? { value, label: value } : undefined) || null
}

export const getAutocompleteDataFromKey = (key: string, items: AutoCompletePreDefinedItems) => {
  switch (key as DefaultPropertiesKeys) {
    case DefaultPropertiesKeys.Account:
      return items.accounts
    case DefaultPropertiesKeys.Cloud:
      return items.clouds
    case DefaultPropertiesKeys.Region:
      return items.regions
    case DefaultPropertiesKeys.Severity:
      return items.severities
    default:
      return [] as AutoCompleteValue[]
  }
}

export const getAutoCompletePropsFromKey = (key: string) => {
  switch (key as DefaultPropertiesKeys) {
    case DefaultPropertiesKeys.Cloud:
      return {
        renderOption: (
          props: HTMLAttributes<HTMLLIElement>,
          option: AutoCompleteValue,
          { inputValue: _, ...state }: AutocompleteRenderOptionState,
        ) =>
          option ? (
            <Fragment key={state.index}>
              {option.value === 'null' ? <Divider /> : null}
              <ListItemButton component="li" {...props} {...state}>
                {option.value !== 'null' ? <CloudAvatar cloud={option.value} /> : null}
                <Typography
                  fontStyle={option.value === 'null' ? 'italic' : undefined}
                  color={option.value === 'null' ? 'primary.main' : undefined}
                  variant={option.value === 'null' ? undefined : 'overline'}
                  ml={option.value === 'null' ? 7 : 2}
                  my={option.value === 'null' ? 1 : undefined}
                >
                  {option.label}
                </Typography>
              </ListItemButton>
            </Fragment>
          ) : (
            ''
          ),
        ListboxComponent: undefined,
        ListboxProps: undefined,
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Clouds</Trans>} />,
      }
    case DefaultPropertiesKeys.Account:
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Accounts</Trans>} />,
      }
    case DefaultPropertiesKeys.Region:
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Regions</Trans>} />,
      }
    case DefaultPropertiesKeys.Severity:
      return {
        renderOption: (
          props: HTMLAttributes<HTMLLIElement>,
          option: AutoCompleteValue,
          { inputValue: _, ...state }: AutocompleteRenderOptionState,
        ) =>
          option ? (
            <Fragment key={state.index}>
              {option.value === 'null' ? <Divider /> : null}
              <ListItemButton component="li" {...props} {...state}>
                <Typography
                  fontStyle={option.value === 'null' ? 'italic' : undefined}
                  color={option.value === 'null' ? 'primary.main' : getColorBySeverity(option.label)}
                >
                  {option.label}
                </Typography>
              </ListItemButton>
            </Fragment>
          ) : (
            ''
          ),
        ListboxComponent: undefined,
        ListboxProps: undefined,
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Severity</Trans>} />,
      }
    default:
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Value</Trans>} />,
      }
  }
}
