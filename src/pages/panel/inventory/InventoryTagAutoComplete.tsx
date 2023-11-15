import { Trans } from '@lingui/macro'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryPropertyAttributesQuery } from 'src/pages/panel/shared/queries'
import { ListboxComponent } from 'src/shared/react-window'

interface InventoryTagAutoCompleteProps {
  searchCrit: string
  setSelectedTag: (tag: string) => void
}

export const InventoryTagAutoComplete = ({ searchCrit, setSelectedTag }: InventoryTagAutoCompleteProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data = [], isLoading } = useQuery({
    queryKey: ['workspace-inventory-property-attributes', selectedWorkspace?.id, 0, 50, searchCrit, 'tags'],
    queryFn: getWorkspaceInventoryPropertyAttributesQuery,
  })
  return (
    <Autocomplete
      disableListWrap
      fullWidth
      loading={isLoading}
      onChange={(_, value) => setSelectedTag(value ?? '')}
      getOptionLabel={(option) => option ?? ''}
      options={data}
      ListboxComponent={ListboxComponent}
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
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
