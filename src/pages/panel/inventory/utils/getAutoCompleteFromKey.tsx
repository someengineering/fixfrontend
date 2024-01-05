import { Trans } from '@lingui/macro'
import { AutocompleteRenderInputParams, AutocompleteRenderOptionState, Divider, ListItemButton, TextField, Typography } from '@mui/material'
import { Fragment, HTMLAttributes } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { AutoCompleteValue } from 'src/shared/types/shared'
import { getArrayFromInOP } from './getArrayFromInOP'

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
  isArray?: false,
  addThemIfNotFound?: boolean,
): null
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string,
  isArray: false,
  addThemIfNotFound: true,
): AutoCompleteValue
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string,
  isArray?: false,
  addThemIfNotFound?: false,
): AutoCompleteValue | null
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: '' | null,
  isArray: true,
  addThemIfNotFound?: boolean,
): []
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string,
  isArray: true,
  addThemIfNotFound?: boolean,
): AutoCompleteValue[]
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string | null,
  isArray?: boolean,
  addThemIfNotFound?: boolean,
): AutoCompleteValue | AutoCompleteValue[] | null
export function getAutocompleteValueFromKey(
  key: string,
  items: AutoCompletePreDefinedItems,
  value: string | null,
  isArray?: boolean,
  addThemIfNotFound?: boolean,
) {
  if (!value || (isArray && value === '[]')) {
    return isArray ? [] : null
  }
  const data = getAutocompleteDataFromKey(key, items)
  return isArray
    ? (getArrayFromInOP(value)
        .map((item) => (data.find((i) => i.value === item) ?? addThemIfNotFound ? { value: item, label: item } : undefined))
        .filter((i) => i) as AutoCompleteValue[])
    : data.find((i) => i.value === value) || (addThemIfNotFound ? { value, label: value } : undefined) || null
}

export const getAutocompleteDataFromKey = (key: string, items: AutoCompletePreDefinedItems) => {
  switch (key) {
    case '/ancestors.account.reported.id':
      return items.accounts
    case '/ancestors.cloud.reported.id':
      return items.clouds
    case '/ancestors.region.reported.id':
      return items.regions
    case '/security.severity':
      return items.severities
    default:
      return [] as AutoCompleteValue[]
  }
}

export const getAutoCompletePropsFromKey = (key: string) => {
  switch (key) {
    case '/ancestors.cloud.reported.id':
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
    case '/ancestors.account.reported.id':
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Accounts</Trans>} />,
      }
    case '/ancestors.region.reported.id':
      return {
        renderInput: (params: AutocompleteRenderInputParams) => <TextField {...params} label={<Trans>Regions</Trans>} />,
      }
    case '/security.severity':
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
