import { Trans, t } from '@lingui/macro'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Autocomplete, AutocompleteRenderOptionState, CircularProgress, ListItemButton, Stack, TextField, Typography } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { ChangeEvent, HTMLAttributes, KeyboardEvent, UIEvent as ReactUIEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventoryPropertyPathCompleteQuery } from 'src/pages/panel/shared/queries'
import { isValidProp, sendInventoryError } from 'src/pages/panel/shared/utils'
import { panelUI } from 'src/shared/constants'
import { OPType, defaultProperties, kindDurationTypes, kindSimpleTypes } from 'src/shared/fix-query-parser'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server-shared'
import { postCostumedWorkspaceInventoryPropertyAttributesQuery } from './utils'

interface InventoryFormFilterRowPropertyProps {
  selectedKinds: string[] | null
  defaultValue?: string | null
  defaultForcedValue?: string
  onChange: (params: {
    property?: string | null
    fqn?: ResourceComplexKindSimpleTypeDefinitions | null
    op?: OPType | null
    value?: string
  }) => void
  kinds: string[]
}

const ITEMS_PER_PAGE = 50

export const InventoryFormFilterRowProperty = ({
  selectedKinds,
  defaultValue,
  defaultForcedValue,
  kinds,
  onChange,
}: InventoryFormFilterRowPropertyProps) => {
  const posthog = usePostHog()
  const { defaultItem, isDefaultSimple } = useMemo(() => {
    const defaultItem = defaultProperties.find((i) => i.label === defaultValue || i.label === defaultForcedValue)
    return {
      defaultItem,
      isDefaultSimple: kindSimpleTypes.includes(defaultItem?.value as ResourceComplexKindSimpleTypeDefinitions),
    }
  }, [defaultValue, defaultForcedValue])

  const [path, setPath] = useState<string>(() => defaultValue?.split('.').slice(0, -1).join('.') ?? '')
  const [prop, setProp] = useState<string>(() => defaultValue?.split('.').slice(-1)[0] ?? '')
  const [propIndex, setPropIndex] = useState(defaultValue?.lastIndexOf('.') ?? 0)
  const prevPropIndex = useRef(propIndex)
  const [fqn, setFqn] = useState<string | null>(defaultItem ? (isDefaultSimple ? null : defaultItem?.value) : 'object')
  const prevFqn = useRef<string | null>(null)
  const [hasFocus, setHasFocus] = useState(false)
  const debouncedPathAndProp = useDebounce(JSON.stringify([path, prop]), panelUI.fastInputChangeDebounce)
  const [debouncedPathDraft, debouncedProp] = JSON.parse(debouncedPathAndProp) as [string, string]
  const debouncedPath = `${defaultForcedValue ?? ''}${defaultForcedValue && debouncedPathDraft ? '.' : ''}${debouncedPathDraft ?? ''}`
  const [value, setValue] = useState<string | null>(defaultValue || null)

  const isDefaultItemSelected = defaultItem?.label == `${path}.${prop}`
  const { currentUser, selectedWorkspace } = useUserProfile()
  const isDictionary = fqn?.startsWith('dictionary') ?? false
  const propertyAttributes = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-path-complete-query',
      selectedWorkspace?.id,
      debouncedPath,
      value === `${debouncedPathDraft}.${debouncedProp}` || value === `${debouncedPathDraft}.${debouncedProp.replace(/\./g, '․')}`
        ? ''
        : debouncedProp,
      selectedKinds?.join(',') ?? null,
      fqn?.split(',')[1]?.split(']')[0]?.trim() ?? '',
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: postCostumedWorkspaceInventoryPropertyAttributesQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id && !!kinds.length && isDictionary,
  })
  const pathComplete = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-path-complete-query',
      selectedWorkspace?.id,
      isDefaultItemSelected ? '' : debouncedPath,
      !fqn || isDefaultItemSelected ? '' : debouncedProp,
      JSON.stringify(selectedKinds ?? kinds),
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: postWorkspaceInventoryPropertyPathCompleteQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id && !!kinds.length && !isDictionary,
  })

  const { data = null, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = isDictionary ? propertyAttributes : pathComplete
  const flatData = useMemo(() => (data?.pages.flat().filter((i) => i) as Exclude<typeof data, null>['pages'][number]) ?? null, [data])
  const highlightedOptionRef = useRef<Exclude<typeof flatData, null>[number] | null>(null)

  useEffect(() => {
    if (error) {
      if (isDictionary) {
        const prop =
          value === `${debouncedPathDraft}.${debouncedProp}` || value === `${debouncedPathDraft}.${debouncedProp.replace(/\./g, '․')}`
            ? ''
            : debouncedProp
        const path = debouncedPathDraft
        sendInventoryError({
          currentUser,
          workspaceId: selectedWorkspace?.id,
          queryFn: 'postCostumedWorkspaceInventoryPropertyAttributesQuery',
          isAdvancedSearch: false,
          error: error as AxiosError,
          params: {
            property: `${path.split('.').slice(-1)[0]}${prop ? `=~"${prop.replace(/․/g, '.')}"` : ''}` ? '' : debouncedProp,
            query: selectedKinds ? `is(${selectedKinds.join(',')})` : 'all',
          },
          posthog,
        })
      } else {
        sendInventoryError({
          currentUser,
          workspaceId: selectedWorkspace?.id,
          queryFn: 'postCostumedWorkspaceInventoryPropertyAttributesQuery',
          isAdvancedSearch: false,
          error: error as AxiosError,
          params: {
            path: isDefaultItemSelected ? '' : debouncedPath,
            property: !fqn || isDefaultItemSelected ? '' : debouncedProp,
            kinds: selectedKinds ?? kinds,
            fuzzy: true,
          },
          posthog,
        })
      }
    }
  }, [
    debouncedPathDraft,
    debouncedPath,
    debouncedProp,
    error,
    fqn,
    isDefaultItemSelected,
    isDictionary,
    kinds,
    selectedKinds,
    selectedWorkspace?.id,
    value,
    posthog,
    currentUser,
  ])

  useEffect(() => {
    if (prevPropIndex.current > propIndex) {
      prevFqn.current = defaultItem ? (isDefaultSimple ? null : defaultItem?.value) : 'object'
      setFqn(defaultItem ? (isDefaultSimple ? null : defaultItem?.value) : 'object')
    }
    prevPropIndex.current = propIndex
  }, [defaultItem, isDefaultSimple, propIndex])

  const handleScroll = (e: ReactUIEvent<HTMLUListElement, UIEvent>) => {
    if (
      hasNextPage &&
      e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - (e.currentTarget.scrollTop + panelUI.offsetHeightToLoad) <= 0 &&
      !isFetchingNextPage
    ) {
      void fetchNextPage()
    }
  }
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      if (value) {
        return true
      }
      handleChange(undefined, highlightedOptionRef.current)
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = e.currentTarget.value.length
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    if (e.key === '.' && !isDictionary) {
      const found = options.find((i) => i.label === e.currentTarget.value)
      if (found) {
        handleChange(undefined, found)
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    setValue(null)
    return true
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\u200B/g, '')
    if (!isDictionary) {
      setFqn('object')
    }
    setValue(null)
    const separatedValue = defaultForcedValue && value.startsWith(`${defaultForcedValue}.`) ? value.split('.').slice(1) : value.split('.')
    if (!isDictionary || separatedValue[separatedValue.length - 1] !== '') {
      const newProp = separatedValue.splice(separatedValue.length - 1, 1)[0]
      if (newProp !== prop) {
        setProp(newProp)
      }
    } else if (isDictionary && separatedValue.includes('․')) {
      const newProp = separatedValue.splice(separatedValue.length - 2, 2).join('․')
      if (newProp !== prop) {
        setProp(newProp)
      }
    } else if (isDictionary) {
      setProp('')
    }
    const newPath = separatedValue.join('.')
    if (newPath !== path) {
      setPath(newPath[newPath.length - 1] === '.' ? newPath.substring(0, newPath.length - 1) : newPath)
    }
    const newPropIndex = separatedValue.filter((i) => i).length
    if (newPropIndex !== propIndex) {
      setPropIndex(newPropIndex)
    }
  }
  const handleChange = (_: unknown, option: string | { key: string; label: string; value: string } | null) => {
    if (option) {
      if (typeof option === 'string') {
        return
      }
      const isSimple = kindSimpleTypes.find((item) => item === option.value || `${item}[` === option.value)
      prevFqn.current = fqn
      setFqn(isSimple ? null : option.value)
      const separatedValue =
        defaultForcedValue && option.label.startsWith(`${defaultForcedValue}.`) ? option.label.split('.').slice(1) : option.label.split('.')
      const newProp = separatedValue.splice(separatedValue.length - 1, 1)[0]
      const newPath = separatedValue.join('.')

      if (isSimple) {
        setValue(option.label)
        setProp(isDictionary ? option.key : newProp)
        setPropIndex(separatedValue.length)
        setPath(newPath)
        setHasFocus(false)
        onChange({
          property:
            isDictionary && !isValidProp(newProp)
              ? `${defaultForcedValue ?? ''}${defaultForcedValue && newPath ? '.' : ''}${newPath}.\`${option.key}\``
              : defaultForcedValue && !option.label.startsWith(defaultForcedValue)
                ? `${defaultForcedValue}.${option.label}`
                : option.label,
          op: kindDurationTypes.includes(option.value as (typeof kindDurationTypes)[number])
            ? '>='
            : option.value === 'boolean'
              ? '='
              : 'in',
          fqn: option.value as ResourceComplexKindSimpleTypeDefinitions,
          value: undefined,
        })
      } else {
        setProp('')
        const enhancedPath = isDictionary && !isValidProp(newPath) ? `${newPath}.\`${option.key.replace(/․/g, '.')}\`` : option.label
        setPropIndex(enhancedPath.split('.').length)
        setPath(enhancedPath)
      }
    } else {
      setValue(null)
      setPath('')
      setProp('')
      setPropIndex(0)
      setFqn(defaultItem ? (isDefaultSimple ? null : defaultItem?.value) : 'object')
      onChange({ property: null, op: null, value: undefined, fqn: null })
    }
  }
  let autoCompleteValue = flatData?.find((i) => i && i.label === value) ?? (defaultValue ? defaultItem : null) ?? null
  let autoCompleteInputValue = path ? `${path}.${prop}` : prop
  if (
    defaultItem &&
    defaultValue === autoCompleteValue?.label &&
    (autoCompleteInputValue === defaultValue || `${autoCompleteInputValue}.${prop}` === defaultValue)
  ) {
    autoCompleteInputValue = defaultItem.key
  }

  const options = flatData?.length ? flatData : autoCompleteValue && !isLoading ? [autoCompleteValue] : []

  if (!autoCompleteValue && value && !options.find((i) => i.label === value)) {
    const index =
      options.push({
        key: value,
        label: value,
        value: fqn || '',
      }) - 1
    autoCompleteValue = options[index]
  }

  const hasError = Boolean((prop || path) && !hasFocus && !value)

  const autoCompleteIsLoading = isLoading || path !== debouncedPathDraft || prop !== debouncedProp

  return (
    <Autocomplete
      value={autoCompleteValue && options.indexOf(autoCompleteValue) > -1 ? autoCompleteValue : null}
      size="small"
      onChange={handleChange}
      onHighlightChange={(_, option) => (highlightedOptionRef.current = option)}
      autoHighlight
      renderOption={(
        props: HTMLAttributes<HTMLLIElement>,
        option: { key: string; label: string; value: string },
        { inputValue: _, ...state }: AutocompleteRenderOptionState,
      ) => {
        const isSimple = kindSimpleTypes.includes(option.value as ResourceComplexKindSimpleTypeDefinitions)
        return (
          <ListItemButton component="li" {...props} {...state} key={`${option.key}_${option.label}_${option.value}_${state.index}`}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" overflow="hidden">
              <Typography overflow="hidden" flexGrow={1} textOverflow="ellipsis" color={isSimple ? undefined : 'info.main'}>
                {option.key}
              </Typography>
              {isSimple ? null : <ArrowForwardIcon fontSize="small" color="info" />}
            </Stack>
          </ListItemButton>
        )
      }}
      sx={{ minWidth: { xs: 190, xl: 250 } }}
      slotProps={{
        popper: {
          sx: { minWidth: 'fit-content!important' },
          placement: 'bottom-start',
        },
      }}
      options={autoCompleteIsLoading ? [] : options}
      open={hasFocus}
      onOpen={() => {
        if (fqn === null && prevFqn.current?.startsWith('dictionary')) {
          setFqn(prevFqn.current)
        }
        setHasFocus(true)
      }}
      groupBy={(item: (typeof defaultProperties)[number]) => (item.isDefaulted ? 'Default Properties' : 'Properties')}
      filterOptions={(options) => options}
      loading={autoCompleteIsLoading}
      ListboxProps={{ onScroll: handleScroll }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={hasError}
          helperText={hasError ? t`Invalid Value` : undefined}
          focused={hasFocus && !!fqn}
          autoFocus
          InputProps={{
            ...params.InputProps,
            startAdornment: defaultForcedValue ? <Typography variant="caption">{defaultForcedValue}</Typography> : undefined,
            endAdornment: (
              <>
                {isLoading || isFetchingNextPage ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          multiline
          inputProps={{
            ...params.inputProps,
            autoFocus: true,
            value: autoCompleteInputValue.replace(/([_.])(?=\S)/g, '$1\u200B'),
            onKeyDown: handleInputKeyDown,
            onFocus: () => setHasFocus(true),
            onBlur: () => setHasFocus(false),
          }}
          label={<Trans>Property</Trans>}
          onChange={handleInputChange}
        />
      )}
    />
  )
}
