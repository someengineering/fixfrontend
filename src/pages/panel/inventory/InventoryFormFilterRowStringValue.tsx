import { t } from '@lingui/macro'
import { Autocomplete, AutocompleteProps, CircularProgress, TextField, TypographyProps } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChangeEvent, ReactNode, UIEvent as ReactUIEvent, useMemo, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryPropertyValuesQuery } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
import { ListboxComponent } from 'src/shared/react-window'
import { AutoCompleteValue } from 'src/shared/types/shared'

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
  const [hasFocus, setHasFocus] = useState(false)
  const [typed, setTyped] = useState('')
  const slectedTyped = useRef('')
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
      typed &&
      (!slectedTyped.current || slectedTyped.current !== typed) &&
      (!value || (Array.isArray(value) ? !value.find((i) => i.label === typed) : value.label !== typed))
        ? `${searchCrit} and ${propertyName} ~ ".*${typed}.*"`
        : searchCrit,
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
    typed && typed.toLocaleLowerCase() !== 'null' && !(Array.isArray(value) ? value.find((i) => i.label === typed) : value?.label === typed)
      ? rawOptions.concat({ value: typed, label: typed })
      : rawOptions

  const optionsWithValues =
    value && (!Array.isArray(value) || value.length)
      ? optionsWithTyped.concat(
          Array.isArray(value)
            ? (value
                .map((i) => (optionsWithTyped.find((j) => j === i || i.value === j.value) ? undefined : i))
                .filter((i) => i && i.value !== 'null') as AutoCompleteValue[])
            : optionsWithTyped.find((j) => value.value === j.value)
              ? []
              : [value],
        )
      : optionsWithTyped
  const options = optionsWithValues.find((i) => i.value === 'null')
    ? optionsWithValues
    : optionsWithValues.concat({ label: 'Null', value: 'null' })

  const currentValue = (
    props.multiple && !Array.isArray(value) ? (value ? [value] : []) : !props.multiple && Array.isArray(value) ? value[0] : value
  ) as typeof value

  const hasError = Boolean(!hasFocus && typed && (Array.isArray(value) ? !value.length : !value))

  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: 250, maxWidth: '100%' }}
      onChange={(_, option) => {
        const newTyped = typeof option === 'string' ? option : !Array.isArray(option) ? option?.label ?? '' : ''
        setTyped(newTyped)
        slectedTyped.current = newTyped
        const newOption =
          (typeof option === 'string'
            ? options.find((i) => i.label === option)
            : Array.isArray(option)
              ? (option
                  .map((i) => (typeof i === 'string' ? options.find((j) => j.label === i) : i))
                  .filter((i) => i) as AutoCompleteValue[])
              : option) || null
        if (!Array.isArray(option)) {
          setHasFocus(false)
        }
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
      isOptionEqualToValue={(option, value) => option.value === value.value}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      loading={isLoading}
      options={options}
      filterOptions={
        networkDisabled
          ? (options, filter) => {
              const inputValue = filter.inputValue.toLowerCase()
              return options.filter((i) => i.label.toLowerCase().includes(inputValue) || i.value.toLowerCase().includes(inputValue))
            }
          : (options) => options
      }
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      open={hasFocus}
      freeSolo
      renderOption={(props, option, state) =>
        [
          {
            ...props,
            onClick: (e: React.MouseEvent<HTMLLIElement>) => {
              if (typed !== e.currentTarget.innerText && !Array.isArray(value)) {
                setTyped(e.currentTarget.innerText)
                if (value?.label !== e.currentTarget.innerText) {
                  const found = options.find((i) => i.label === e.currentTarget.innerText)
                  if (found) {
                    slectedTyped.current = e.currentTarget.innerText
                    onChange(found as typeof value)
                  }
                }
              }
              props?.onClick?.(e)
            },
          },
          option.label,
          state,
          option.value === 'null' ? ({ fontStyle: 'italic', color: 'info.main' } as TypographyProps) : undefined,
        ] as ReactNode
      }
      value={currentValue}
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          error={hasError}
          helperText={hasError ? t`Invalid Value` : undefined}
          type={isNumber && typed !== 'null' && typed !== 'Null' ? 'number' : 'text'}
          focused={hasFocus}
          inputProps={{
            ...params.inputProps,
            onFocus: () => setHasFocus(true),
            onBlur: () => {
              if (!props.multiple) {
                const found = options.find((i) => i.label === typed)
                if (found) {
                  slectedTyped.current = typed
                  onChange(found as typeof value)
                }
              }
              setHasFocus(false)
            },
            value: typed,
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
          onClick={() => setHasFocus(true)}
          onChange={(e) => {
            slectedTyped.current = ''
            if (isNumber) {
              const curValue = e.currentTarget.value
              const num = Number(curValue)
              if (curValue === '' || curValue === 'null' || curValue === 'Null' || !Number.isNaN(num)) {
                if (curValue === '' || curValue === 'null' || curValue === 'Null') {
                  setTyped(curValue)
                } else if (isDouble) {
                  setTyped(num.toString())
                } else {
                  setTyped(Math.round(num).toString())
                }
              }
            } else {
              setTyped(e.currentTarget.value)
            }
            params.inputProps.onChange?.(e as ChangeEvent<HTMLInputElement>)
          }}
        />
      )}
    />
  )
}
