import { Autocomplete, AutocompleteProps, CircularProgress, TextField } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChangeEvent, ReactNode, UIEvent as ReactUIEvent, useMemo, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryPropertyValuesQuery } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
import { ListboxComponent } from 'src/shared/react-window'
import { AutoCompleteValue } from './utils'

const ITEMS_PER_PAGE = 50

interface InventoryFormFilterRowStringValueProps<Multiple extends boolean, NetworkDisabled extends boolean>
  extends Omit<AutocompleteProps<AutoCompleteValue, Multiple, false, true>, 'onChange' | 'value' | 'renderInput' | 'options'> {
  multiple: Multiple
  searchCrit: string
  networkDisabled: NetworkDisabled
  defaultOptions?: AutoCompleteValue[]
  propertyName: string
  isNumber: boolean
  isDouble: boolean
  value: Multiple extends true ? AutoCompleteValue[] : AutoCompleteValue | null
  onChange: (option: Multiple extends true ? AutoCompleteValue[] : AutoCompleteValue | null) => void
}

export function InventoryFormFilterRowStringValue<Multiple extends boolean, NetworkDisabled extends boolean>({
  defaultOptions,
  networkDisabled,
  onChange,
  searchCrit,
  propertyName,
  isNumber,
  isDouble,
  value,
  ...props
}: InventoryFormFilterRowStringValueProps<Multiple, NetworkDisabled>) {
  const { selectedWorkspace } = useUserProfile()
  const [typed, setTyped] = useState('')
  const {
    data = null,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-values',
      selectedWorkspace?.id,
      typed ? `${searchCrit} and ${propertyName} ~ ".*${typed}.*"` : searchCrit,
      propertyName,
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: getWorkspaceInventoryPropertyValuesQuery,
    throwOnError: false,
    enabled: !!(selectedWorkspace?.id && !networkDisabled),
  })
  const flatData = useMemo(
    () =>
      data?.pages
        .flat()
        .filter((i) => i)
        .map((i) => ({ label: i as string, value: i as string })) ?? null,
    [data],
  )

  const handleScroll = (e: ReactUIEvent<HTMLUListElement, UIEvent>) => {
    if (
      hasNextPage &&
      e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - (e.currentTarget.scrollTop + panelUI.offsetHeightToLoad) <= 0 &&
      !isFetchingNextPage
    ) {
      void fetchNextPage()
    }
  }
  const rawOptions = (networkDisabled ? defaultOptions : flatData) ?? []

  const optionsWithTyped =
    typed &&
    !(Array.isArray(value)
      ? value.find((i) => (typeof i === 'string' ? i : i.label) === typed)
      : (typeof value === 'string' ? value : value?.label) === typed)
      ? rawOptions.concat({ value: typed, label: typed })
      : rawOptions

  const optionsWithValues =
    value && (!Array.isArray(value) || value.length)
      ? optionsWithTyped.concat(
          typeof value === 'string'
            ? !optionsWithTyped.find((i) => i.label === value)
              ? [{ value, label: value } as AutoCompleteValue]
              : []
            : Array.isArray(value)
              ? value
                  .map((i) => (optionsWithTyped.find((j) => (typeof i === 'string' ? j.label === i : j === i)) ? undefined : i))
                  .filter((i) => i)
                  .map((i) => (typeof i === 'string' ? { label: i, value: i } : (i as AutoCompleteValue)))
              : optionsWithTyped.indexOf(value) > -1
                ? [value]
                : [],
        )
      : optionsWithTyped

  const options = optionsWithValues.find((i) => i.value === 'null')
    ? optionsWithValues
    : optionsWithValues.concat({ label: 'Null', value: 'null' })

  const currentValue = (
    props.multiple && !Array.isArray(value) ? (value ? [value] : []) : !props.multiple && Array.isArray(value) ? value[0] : value
  ) as typeof value

  return (
    <Autocomplete
      size="small"
      sx={{ width: 250, maxWidth: '100%' }}
      onChange={(_, option) => {
        setTyped(typeof option === 'string' ? option : !Array.isArray(option) ? option?.label ?? '' : '')
        const newOption =
          (typeof option === 'string'
            ? options.find((i) => i.label === option)
            : Array.isArray(option)
              ? (option
                  .map((i) => (typeof i === 'string' ? options.find((j) => j.label === i) : i))
                  .filter((i) => i) as AutoCompleteValue[])
              : option) || null
        onChange(
          (props.multiple
            ? Array.isArray(newOption)
              ? newOption
              : newOption
                ? [newOption]
                : []
            : Array.isArray(newOption)
              ? newOption[0] || null
              : newOption || null) as Multiple extends true ? AutoCompleteValue[] : AutoCompleteValue | null,
        )
      }}
      limitTags={1}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      options={options}
      filterOptions={networkDisabled ? undefined : (options) => options}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      freeSolo
      renderOption={(props, option, state) => [props, option.label, state] as ReactNode}
      value={currentValue}
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          type={isNumber ? 'number' : 'text'}
          inputProps={{
            ...params.inputProps,
            value: typed,
            onChange: (e) => {
              if (isNumber) {
                const num = Number(e.currentTarget.value)
                if (!Number.isNaN(num)) {
                  if (isDouble) {
                    setTyped(num.toString())
                  } else {
                    setTyped(Math.round(num).toString())
                  }
                }
              } else {
                setTyped(e.currentTarget.value)
              }
              params.inputProps.onChange?.(e as ChangeEvent<HTMLInputElement>)
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading || isFetchingNextPage ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
