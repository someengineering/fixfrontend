import { Trans } from '@lingui/macro'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Autocomplete, AutocompleteRenderOptionState, CircularProgress, ListItemButton, Stack, TextField, Typography } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
// import { useDebounce } from '@uidotdev/usehooks'
import { ChangeEvent, KeyboardEvent, UIEvent as ReactUIEvent, useMemo, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { OPType, defaultProperties, kindSimpleTypes } from 'src/pages/panel/shared/constants'
import { getWorkspaceInventoryPropertyPathCompleteQuery } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
// import { panelUI } from 'src/shared/constants'
import { HTMLAttributes } from 'react'
import { isValidProp } from 'src/pages/panel/shared/utils'
import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server'
import { getCustomedWorkspaceInventoryPropertyAttributesQuery } from './utils'

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
  const [fqn, setFqn] = useState<string | null>(defaultItem ? (isDefaultSimple ? null : defaultItem?.value) : 'object')
  const [hasFocus, setHasFocus] = useState(false)
  // const debouncedPathAndProp = useDebounce(JSON.stringify([path, prop]), panelUI.fastInputChangeDebounce)
  // const [debouncedPath, debouncedProp] = JSON.parse(debouncedPathAndProp) as [string, string]
  const [value, setValue] = useState<string | null>(defaultValue || null)
  const { selectedWorkspace } = useUserProfile()
  const isDictionary = fqn?.startsWith('dictionary') ?? false
  const {
    data = null,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-path-complete-query',
      selectedWorkspace?.id,
      path,
      isDictionary ? fqn?.split(',')[1].split(']')[0].trim() ?? '' : prop,
      selectedKind,
      JSON.stringify(kinds),
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: isDictionary ? getCustomedWorkspaceInventoryPropertyAttributesQuery : getWorkspaceInventoryPropertyPathCompleteQuery,
    enabled: !!selectedWorkspace?.id && !!kinds.length,
  })
  const flatData = useMemo(() => (data?.pages.flat().filter((i) => i) as Exclude<typeof data, null>['pages'][number]) ?? null, [data])
  const highlightedOptionRef = useRef<Exclude<typeof flatData, null>[number] | null>(null)
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
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === '.') {
      handleChange(undefined, highlightedOptionRef.current)
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = e.currentTarget.value.length
    }
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFqn('object')
    setValue(null)
    const separatedValue = value.split('.')
    const newProp = separatedValue.splice(separatedValue.length - 1, 1)[0]
    const newPath = separatedValue.join('.')
    if (newProp !== prop) {
      setProp(newProp)
    }
    if (newPath !== path) {
      setPath(newPath)
    }
  }
  const handleChange = (_: unknown, option: string | { key: string; label: string; value: string } | null) => {
    if (option) {
      if (typeof option === 'string') {
        return
      }
      const isSimple = kindSimpleTypes.includes(option.value as ResourceComplexKindSimpleTypeDefinitions)
      setValue(option.label)
      setFqn(isSimple ? null : option.value)
      const separatedValue = option.label.split('.')
      const newProp = separatedValue.splice(separatedValue.length - 1, 1)[0]
      const newPath = separatedValue.join('.')
      if (isSimple) {
        setProp(newProp)
        setPath(newPath)
        onChange({
          property: isDictionary && !isValidProp(newProp) ? `${newPath}.\`${newProp}\`` : option.label,
          op: '=',
          fqn: option.value as ResourceComplexKindSimpleTypeDefinitions,
        })
      } else {
        setProp('')
        setPath(isDictionary && !isValidProp(newPath) ? `${newPath}.\`${newProp}\`` : option.label)
      }
    } else {
      setValue(null)
      setPath('')
      setProp('')
      setFqn('object')
      onChange({ property: null, op: null, value: null, fqn: null })
    }
  }
  const autoCompleteValue = flatData?.find((i) => i && i.label === value) ?? (defaultValue ? defaultItem : null)
  let autoCompleteInputValue = path ? `${path}.${prop}` : prop
  if (
    defaultItem &&
    defaultValue === autoCompleteValue?.label &&
    (autoCompleteInputValue === defaultValue || `${autoCompleteInputValue}.${prop}` === defaultValue)
  ) {
    autoCompleteInputValue = defaultItem.key
  }

  return (
    <Autocomplete
      value={autoCompleteValue ?? null}
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
          <ListItemButton component="li" {...props} {...state}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" overflow="hidden">
              <Typography overflow="hidden" flexGrow={1} textOverflow="ellipsis" color={isSimple ? undefined : 'info.main'}>
                {option.key}
              </Typography>
              {isSimple ? null : <ArrowForwardIcon fontSize="small" color="info" />}
            </Stack>
          </ListItemButton>
        )
      }}
      sx={{ minWidth: 250 }}
      options={flatData ?? (autoCompleteValue && !isLoading ? [autoCompleteValue] : [])}
      open={hasFocus && !!fqn}
      groupBy={(item: (typeof defaultProperties)[number]) => (item.isDefaulted ? 'Default Properties' : 'Properties')}
      loading={isLoading}
      ListboxProps={{ onScroll: handleScroll }}
      renderInput={(params) => (
        <TextField
          {...params}
          focused={hasFocus && !!fqn}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
      )}
    />
  )
}
