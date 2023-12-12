import { Trans } from '@lingui/macro'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { ReactNode, UIEvent as ReactUIEvent, useEffect, useMemo, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryPropertyAttributesQuery } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
import { ListboxComponent } from 'src/shared/react-window'
import { useInventorySendToGTM } from './utils/useInventorySendToGTM'

interface InventoryTagAutoCompleteProps {
  searchCrit: string
  setSelectedTag: (tag: string) => void
}

const ITEMS_PER_PAGE = 50

export const InventoryTagAutoComplete = ({ searchCrit, setSelectedTag }: InventoryTagAutoCompleteProps) => {
  const [typed, setTyped] = useState('')
  const debouncedTyped = useDebounce(typed, panelUI.fastInputChangeDebounce)
  const { selectedWorkspace } = useUserProfile()
  const {
    data = null,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'workspace-inventory-property-attributes',
      selectedWorkspace?.id,
      searchCrit.startsWith('is') ? searchCrit.split(' ')[0] : 'all',
      `tags${debouncedTyped ? `=~${debouncedTyped}` : ''}`,
    ] as const,
    initialPageParam: {
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      (lastPage?.length ?? 0) < ITEMS_PER_PAGE ? undefined : { ...lastPageParam, skip: lastPageParam.skip + ITEMS_PER_PAGE },
    queryFn: getWorkspaceInventoryPropertyAttributesQuery,
    throwOnError: false,
    enabled: !!selectedWorkspace?.id,
  })
  const sendToGTM = useInventorySendToGTM()
  useEffect(() => {
    if (error) {
      sendToGTM('getWorkspaceInventoryPropertyAttributesQuery', false, error as AxiosError, {
        workspaceId: selectedWorkspace?.id,
        query: searchCrit.startsWith('is') ? searchCrit.split(' ')[0] : 'all',
        prop: `tags${debouncedTyped ? `=~${debouncedTyped}` : ''}`,
      })
    }
  }, [debouncedTyped, error, searchCrit, selectedWorkspace?.id, sendToGTM])
  const flatData = useMemo(() => (data?.pages.flat().filter((i) => i) as Exclude<typeof data, null>['pages'][number]) ?? null, [data])
  const handleScroll = (e: ReactUIEvent<HTMLUListElement, UIEvent>) => {
    if (
      hasNextPage &&
      e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - (e.currentTarget.scrollTop + panelUI.offsetHeightToLoad) <= 0 &&
      !isFetchingNextPage
    ) {
      void fetchNextPage()
    }
  }
  return (
    <Autocomplete
      size="small"
      disableListWrap
      fullWidth
      loading={isLoading}
      onChange={(_, value) => setSelectedTag(value ?? '')}
      getOptionLabel={(option) => option ?? ''}
      filterOptions={(option) => option}
      options={isLoading ? [] : flatData ?? []}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      value={null}
      renderOption={(props, option, state) => [props, option, state] as ReactNode}
      renderInput={(params) => (
        <TextField
          {...params}
          label={<Trans>Tags</Trans>}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading || isFetchingNextPage ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          onChange={(e) => setTyped(e.target.value)}
        />
      )}
    />
  )
}
