import { Trans, t } from '@lingui/macro'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  CircularProgress,
  ListItemButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { ChangeEvent, HTMLAttributes, KeyboardEvent, UIEvent as ReactUIEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { OPType, defaultProperties, kindDurationTypes, kindSimpleTypes } from 'src/pages/panel/shared/constants'
import { getWorkspaceInventoryPropertyPathCompleteQuery } from 'src/pages/panel/shared/queries'
import { isValidProp } from 'src/pages/panel/shared/utils'
import { panelUI } from 'src/shared/constants'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { getCustomedWorkspaceInventoryPropertyAttributesQuery, inventorySendToGTM } from './utils'

interface InventoryFormFilterRowPropertyProps {
  selectedKind: string | null
  defaultValue?: string | null
  onChange: (params: {
    property?: string | null
    fqn?: ResourceComplexKindSimpleTypeDefinitions | null
    op?: OPType | null
    value?: string | null
  }) => void
  kinds: string[]
}

const ITEMS_PER_PAGE = 50

export const InventoryFormFilterRowProperty = ({ selectedKind, defaultValue, kinds, onChange }: InventoryFormFilterRowPropertyProps) => {
  const { defaultItem, isDefaultSimple } = useMemo(() => {
    const defaultItem = defaultProperties.find((i) => i.label === defaultValue)
    return {
      defaultItem,
      isDefaultSimple: kindSimpleTypes.includes(defaultItem?.value as ResourceComplexKindSimpleTypeDefinitions),
    }
  }, [defaultValue])

  const [path, setPath] = useState<string>(() => defaultValue?.split('.').slice(0, -1).join('.') ?? '')
  const [prop, setProp] = useState<string>(() => defaultValue?.split('.').slice(-1)[0] ?? '')
  const [propIndex, setPropIndex] = useState(defaultValue?.lastIndexOf('.') ?? 0)
  const prevPropIndex = useRef(propIndex)
  const [fqn, setFqn] = useState<string | null>(defaultItem ? (isDefaultSimple ? null : defaultItem?.value) : 'object')
  const prevFqn = useRef<string | null>(null)
  const [hasFocus, setHasFocus] = useState(false)
  const debouncedPathAndProp = useDebounce(JSON.stringify([path, prop]), panelUI.fastInputChangeDebounce)
  const [debouncedPath, debouncedProp] = JSON.parse(debouncedPathAndProp) as [string, string]
  const [value, setValue] = useState<string | null>(defaultValue || null)

  const isDefaultItemSelected = defaultItem?.label == `${path}.${prop}`
  const { selectedWorkspace } = useUserProfile()
  const isDictionary = fqn?.startsWith('dictionary') ?? false
  const propertyAttributes = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-path-complete-query',
      selectedWorkspace?.id,
      debouncedPath,
      value === `${debouncedPath}.${debouncedProp}` || value === `${debouncedPath}.${debouncedProp.replace(/\./g, '․')}`
        ? ''
        : debouncedProp,
      selectedKind,
      fqn?.split(',')[1]?.split(']')[0]?.trim() ?? '',
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: getCustomedWorkspaceInventoryPropertyAttributesQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id && !!kinds.length && isDictionary,
  })
  const kindsStr = JSON.stringify(kinds)
  const pathComplete = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-path-complete-query',
      selectedWorkspace?.id,
      isDefaultItemSelected ? '' : debouncedPath,
      !fqn || isDefaultItemSelected ? '' : debouncedProp,
      selectedKind,
      kindsStr,
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: getWorkspaceInventoryPropertyPathCompleteQuery,
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
          value === `${debouncedPath}.${debouncedProp}` || value === `${debouncedPath}.${debouncedProp.replace(/\./g, '․')}`
            ? ''
            : debouncedProp
        const path = debouncedPath
        inventorySendToGTM('getCustomedWorkspaceInventoryPropertyAttributesQuery', false, error as AxiosError, {
          workspaceId: selectedWorkspace?.id,
          prop: `${path.split('.').slice(-1)[0]}${prop ? `=~"${prop.replace(/․/g, '.')}"` : ''}` ? '' : debouncedProp,
          query: selectedKind ? `is(${selectedKind})` : 'all',
        })
      } else {
        inventorySendToGTM('getCustomedWorkspaceInventoryPropertyAttributesQuery', false, error as AxiosError, {
          workspaceId: selectedWorkspace?.id,
          path: isDefaultItemSelected ? '' : debouncedPath,
          prop: !fqn || isDefaultItemSelected ? '' : debouncedProp,
          kinds: selectedKind ? [selectedKind] : (JSON.parse(kindsStr) as string[]),
          fuzzy: true,
        })
      }
    }
  }, [debouncedPath, debouncedProp, error, fqn, isDefaultItemSelected, isDictionary, kindsStr, selectedKind, selectedWorkspace?.id, value])

  useEffect(() => {
    if (prevPropIndex.current > propIndex) {
      prevFqn.current = 'object'
      setFqn('object')
    }
    prevPropIndex.current = propIndex
  }, [propIndex])

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
    const value = e.target.value
    if (!isDictionary) {
      setFqn('object')
    }
    setValue(null)
    const separatedValue = value.split('.')
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
      const isSimple = kindSimpleTypes.includes(option.value as ResourceComplexKindSimpleTypeDefinitions)
      prevFqn.current = fqn
      setFqn(isSimple ? null : option.value)
      const separatedValue = option.label.split('.')
      const newProp = separatedValue.splice(separatedValue.length - 1, 1)[0]
      const newPath = separatedValue.join('.')
      if (isSimple) {
        setValue(option.label)
        setProp(isDictionary ? option.key : newProp)
        setPropIndex(separatedValue.length)
        setPath(newPath)
        setHasFocus(false)
        onChange({
          property: isDictionary && !isValidProp(newProp) ? `${newPath}.\`${option.key}\`` : option.label,
          op: kindDurationTypes.includes(option.value as (typeof kindDurationTypes)[number]) ? '>=' : '=',
          fqn: option.value as ResourceComplexKindSimpleTypeDefinitions,
          value: null,
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
      setFqn('object')
      onChange({ property: null, op: null, value: null, fqn: null })
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

  const autoCompleteIsLoading = isLoading || path !== debouncedPath || prop !== debouncedProp

  return (
    <Autocomplete
      value={autoCompleteValue && options.indexOf(autoCompleteValue) > -1 ? autoCompleteValue : null}
      size="small"
      disablePortal
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
      sx={{ width: { xs: '100%', lg: 250 } }}
      slotProps={{
        popper: {
          sx: { width: 'fit-content!important' },
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
        <Tooltip title={autoCompleteInputValue}>
          <TextField
            {...params}
            error={hasError}
            helperText={hasError ? t`Invalid Value` : undefined}
            focused={hasFocus && !!fqn}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading || isFetchingNextPage ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            inputProps={{
              ...params.inputProps,
              value: autoCompleteInputValue,
              onKeyDown: handleInputKeyDown,
              onFocus: () => setHasFocus(true),
              onBlur: () => setHasFocus(false),
            }}
            label={<Trans>Property</Trans>}
            onChange={handleInputChange}
          />
        </Tooltip>
      )}
    />
  )
}
