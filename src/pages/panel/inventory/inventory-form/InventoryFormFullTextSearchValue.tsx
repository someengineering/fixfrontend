import { t } from '@lingui/macro'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { Box, ButtonBase, Stack, TextField, alpha, outlinedInputClasses } from '@mui/material'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useRef, useState } from 'react'
import { panelUI } from 'src/shared/constants'

interface InventoryFormFullTextSearchValueProps {
  fullTextSearch: string
  onChange: (fullTextSearch: string) => void
}

export const InventoryFormFullTextSearchValue = ({ onChange, fullTextSearch }: InventoryFormFullTextSearchValueProps) => {
  const [value, setValue] = useState(fullTextSearch ?? '')
  const debouncedValue = useDebounce(value, panelUI.fastInputChangeDebounce)
  const prevDebouncedValue = useRef(value)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    setValue(fullTextSearch)
  }, [fullTextSearch])

  useEffect(() => {
    if (prevDebouncedValue.current !== debouncedValue) {
      onChange(debouncedValue)
      prevDebouncedValue.current = debouncedValue
    }
  }, [debouncedValue, onChange])

  return (
    <Stack gap={1} width={focused ? 270 : value ? 190 : 170} sx={{ transition: ({ transitions: { create } }) => create('width') }}>
      <Box boxShadow={4} borderRadius={1} height={42}>
        <TextField
          fullWidth
          focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          id="full-text-search"
          name="full-text-search"
          autoComplete="search"
          label={t`Full-text search`}
          variant="outlined"
          value={value}
          size="small"
          color="primary"
          InputLabelProps={{ sx: { color: 'primary.main', fontWeight: 700, fontSize: 14, top: 3 } }}
          InputProps={{
            sx: { height: 42, color: 'primary.main', fontWeight: 600, fontSize: 16 },
            endAdornment: (
              <Stack direction="row" spacing={0.5}>
                {value ? (
                  <ButtonBase onClick={() => setValue('')} sx={{ borderRadius: '50%' }}>
                    <ClearIcon fontSize="small" />
                  </ButtonBase>
                ) : null}
                <SearchIcon fontSize="small" />
              </Stack>
            ),
          }}
          sx={{
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: ({
                palette: {
                  primary: { main },
                },
              }) => alpha(main, 0.5),
            },
            height: 42,
          }}
          onChange={(e) => setValue(e.target.value ?? '')}
        />
      </Box>
    </Stack>
  )
}
