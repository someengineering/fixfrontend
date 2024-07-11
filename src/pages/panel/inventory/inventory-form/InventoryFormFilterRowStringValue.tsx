import { t } from '@lingui/macro'
import { Autocomplete, AutocompleteProps, Chip, CircularProgress, TextField, TypographyProps } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { ChangeEvent, ReactNode, UIEvent as ReactUIEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventoryPropertyValuesQuery } from 'src/pages/panel/shared/queries'
import { sendInventoryError } from 'src/pages/panel/shared/utils'
import { panelUI } from 'src/shared/constants'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { ListboxComponent } from 'src/shared/react-window'
import { AutoCompleteValue } from 'src/shared/types/shared'

const ITEMS_PER_PAGE = 50

interface InventoryFormFilterRowStringValueProps<Multiple extends boolean, NetworkDisabled extends boolean>
  extends Omit<AutocompleteProps<AutoCompleteValue, Multiple, false, true>, 'onChange' | 'value' | 'renderInput' | 'options' | 'onClose'> {
  multiple: Multiple
  networkDisabled: NetworkDisabled
  defaultOptions?: AutoCompleteValue[]
  propertyName: string
  isNumber: boolean
  isDouble: boolean
  value: Multiple extends true ? AutoCompleteValue[] : AutoCompleteValue | null
  onChange: (option: Multiple extends true ? AutoCompleteValue[] : AutoCompleteValue | null) => void
  onClose?: () => void
}

export function InventoryFormFilterRowStringValue<Multiple extends boolean, NetworkDisabled extends boolean>({
  defaultOptions,
  networkDisabled,
  onChange,
  onClose,
  propertyName,
  isNumber,
  isDouble,
  value,
  ...props
}: InventoryFormFilterRowStringValueProps<Multiple, NetworkDisabled>) {
  const postHog = usePostHog()
  const { currentUser, selectedWorkspace } = useUserProfile()
  const { query } = useFixQueryParser()
  const [open, setOpen] = useState(false)
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current) {
      const timeout = window.setTimeout(() => {
        initializedRef.current = true
        setOpen(true)
      }, 150)

      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [])
  useEffect(() => {
    if (initializedRef.current && onClose && !open) {
      onClose()
    }
  }, [open, onClose])
  const [typed, setTyped] = useState(value && !Array.isArray(value) ? value.label : '')
  const debouncedTyped = useDebounce(networkDisabled ? '' : typed, panelUI.fastInputChangeDebounce)
  const selectedTyped = useRef('')
  const q = useMemo(() => query?.delete_predicate(propertyName), [propertyName, query])?.toString() ?? 'all'
  const {
    data = null,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-values',
      selectedWorkspace?.id,
      debouncedTyped &&
      (!selectedTyped.current || selectedTyped.current !== debouncedTyped) &&
      (!value || (Array.isArray(value) ? !value.find((i) => i.label === debouncedTyped) : value.label !== debouncedTyped))
        ? `${q} and ${propertyName} ~ ".*${debouncedTyped}.*"`
        : q,
      propertyName,
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: postWorkspaceInventoryPropertyValuesQuery,
    throwOnError: false,
    enabled: !!(selectedWorkspace?.id && !networkDisabled),
  })
  useEffect(() => {
    if (error) {
      sendInventoryError({
        currentUser,
        workspaceId: selectedWorkspace?.id,
        queryFn: 'postWorkspaceInventoryPropertyValuesQuery',
        isAdvancedSearch: false,
        error: error as AxiosError,
        params: {
          property: propertyName,
          query:
            debouncedTyped &&
            (!selectedTyped.current || selectedTyped.current !== debouncedTyped) &&
            (!value || (Array.isArray(value) ? !value.find((i) => i.label === debouncedTyped) : value.label !== debouncedTyped))
              ? `${q} and ${propertyName} ~ ".*${debouncedTyped}.*"`
              : q,
        },
        postHog,
      })
    }
  }, [currentUser, debouncedTyped, error, postHog, propertyName, q, selectedWorkspace?.id, value])
  const flatData = useMemo(
    () =>
      data?.pages
        .flat()
        .filter((i) => i)
        .map((i) => ({ label: i as string, value: i as string, id: i as string })) ?? null,
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
    typed.toLowerCase() !== 'null' &&
    typed.toLowerCase() !== 'undefined' &&
    typed.toLowerCase() !== t`Undefined`.toLowerCase() &&
    !(Array.isArray(value) ? value.find((i) => i.label === typed) : value?.label === typed)
      ? rawOptions.concat({ value: typed, label: typed, id: typed })
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
    : optionsWithValues.concat({ label: t`Undefined`, value: 'null', id: 'null' })

  const currentValue = (
    props.multiple && !Array.isArray(value) ? (value ? [value] : []) : !props.multiple && Array.isArray(value) ? value[0] : value
  ) as typeof value

  const hasError = Boolean(!open && typed && (Array.isArray(value) ? !value.length : !value))

  const autoCompleteIsLoading = isLoading || (!networkDisabled && debouncedTyped !== typed)

  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: 250, maxWidth: '100%' }}
      onChange={(_, option) => {
        const newTyped = typeof option === 'string' ? option : !Array.isArray(option) ? option?.label ?? '' : ''
        setTyped(newTyped)
        selectedTyped.current = newTyped
        const newOption =
          (typeof option === 'string'
            ? options.find((i) => i.label === option)
            : Array.isArray(option)
              ? (option
                  .map((i) => (typeof i === 'string' ? options.find((j) => j.label === i) : i))
                  .filter((i) => i) as AutoCompleteValue[])
              : option) || null
        if (!Array.isArray(option)) {
          setOpen(false)
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
      loading={autoCompleteIsLoading}
      options={autoCompleteIsLoading ? [] : options}
      filterOptions={
        networkDisabled
          ? (options, filter) => {
              const inputValue = filter.inputValue.toLowerCase()
              return options.filter((i) => i.label.toLowerCase().includes(inputValue) || i.value.toLowerCase().includes(inputValue))
            }
          : (options) => options
      }
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      onOpen={() => {
        if (initializedRef.current) {
          setOpen(true)
        }
      }}
      open={open}
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
                    selectedTyped.current = e.currentTarget.innerText
                    onChange(found as typeof value)
                  }
                }
              }
              props?.onClick?.(e)
            },
          },
          option.label,
          state,
          option.value === 'null' ? ({ color: 'error.dark' } as TypographyProps) : undefined,
        ] as ReactNode
      }
      value={currentValue}
      renderTags={
        props.multiple
          ? (tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })
                return (
                  <Chip
                    key={key}
                    variant="outlined"
                    label={option.label}
                    size="small"
                    color={option.label === 'null' ? 'error' : 'primary'}
                    {...tagProps}
                  />
                )
              })
          : undefined
      }
      autoFocus
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          error={hasError}
          helperText={hasError ? t`Invalid Value` : undefined}
          type={
            isNumber &&
            typed.toLowerCase() !== 'null' &&
            typed.toLowerCase() !== 'undefined' &&
            typed.toLowerCase() !== t`Undefined`.toLowerCase()
              ? 'number'
              : 'text'
          }
          focused={open}
          autoFocus
          inputProps={{
            ...params.inputProps,
            onBlur: () => {
              if (!props.multiple) {
                const found = options.find((i) => i.label === typed)
                if (found) {
                  selectedTyped.current = typed
                  onChange(found as typeof value)
                }
              }
            },
            value: typed,
            autoFocus: true,
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {autoCompleteIsLoading || isFetchingNextPage ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            onFocus: () => {
              if (initializedRef.current) {
                setOpen(true)
              }
            },
            onBlur: () => setOpen(false),
            autoFocus: true,
          }}
          onChange={(e) => {
            selectedTyped.current = ''
            if (isNumber) {
              const curValue = e.currentTarget.value
              const num = Number(curValue)
              if (
                curValue === '' ||
                curValue.toLowerCase() === 'null' ||
                curValue.toLowerCase() === 'undefined' ||
                curValue.toLowerCase() === t`Undefined`.toLowerCase() ||
                !Number.isNaN(num)
              ) {
                if (
                  curValue === '' ||
                  curValue.toLowerCase() === 'null' ||
                  curValue.toLowerCase() === 'undefined' ||
                  curValue.toLowerCase() === t`Undefined`.toLowerCase()
                ) {
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
