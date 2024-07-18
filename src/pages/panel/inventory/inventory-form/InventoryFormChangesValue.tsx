import { Trans, t } from '@lingui/macro'
import { Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack, formLabelClasses } from '@mui/material'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import { WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'
import { allHistoryChangesOptions } from './utils/allHistoryChangesOptions'

interface InventoryFormChangeValueProps {
  searchParamsChanges: string[] | null
  searchParamsAfter: string | null
  searchParamsBefore: string | null
  onChange: (searchParamsChanges: string[], searchParamsAfter: string | null, searchParamsBefore: string | null) => void
}

const getOptionsLabel = (option: WorkspaceInventorySearchTableHistoryChanges) => {
  switch (option) {
    case 'node_compliant':
      return t`Node Compliant`
    case 'node_created':
      return t`Node Created`
    case 'node_updated':
      return t`Node Updated`
    case 'node_deleted':
      return t`Node Deleted`
    case 'node_vulnerable':
      return t`Node Vulnerable`
  }
  return option
}

const getOptions = () => allHistoryChangesOptions.map((value) => ({ value, label: getOptionsLabel(value) }))

export const InventoryFormChangeValue = ({
  onChange,
  searchParamsAfter,
  searchParamsBefore,
  searchParamsChanges,
}: InventoryFormChangeValueProps) => {
  const options = getOptions()
  const value = searchParamsChanges?.length ? searchParamsChanges : [...allHistoryChangesOptions]
  return (
    <Stack width="100%" flexGrow={1} direction="row" flexWrap="wrap" overflow="auto" mt={-2} pt={2} mb={-1}>
      <FormControl sx={{ pt: 1, mt: -1 }}>
        <InputLabel
          id="change-type"
          color="primary"
          sx={{
            color: 'primary.main',
            mt: '3px',
            fontSize: 14,
            fontWeight: 700,
            [`&.${formLabelClasses.filled},&.${formLabelClasses.focused}`]: { mt: '9px' },
          }}
        >
          <Trans>Change Type</Trans>
        </InputLabel>
        <Select
          sx={{
            fontSize: 14,
            minWidth: 200,
            mb: 1,
            mr: 1,
            height: '100%',
            '& svg': {
              color: 'primary.main',
            },
          }}
          value={value}
          multiple
          variant="outlined"
          onChange={(e) => {
            if (value.length) {
              onChange(typeof e.target.value === 'string' ? [e.target.value] : e.target.value, searchParamsAfter, searchParamsBefore)
            }
          }}
          input={
            <OutlinedInput
              label={t`Change Type`}
              color="primary"
              slotProps={{
                input: {
                  sx: {
                    color: 'primary.main',
                    pl: 2,
                    pr: 0.5,
                    py: 0.75,
                    fontWeight: 700,
                  },
                },
              }}
            />
          }
          renderValue={(selected) =>
            selected.length === options.length
              ? t`All`
              : selected.map((item) => options.find((option) => option.value === item)?.label ?? item).join(', ')
          }
          size="small"
          autoFocus={!searchParamsChanges}
          labelId="change-type"
        >
          {options.map((option, index) => {
            return (
              <MenuItem value={option.value} dense key={index} disabled={(value.indexOf(option.value) ?? -1) > -1 && value.length === 1}>
                <Checkbox checked={(value.indexOf(option.value) ?? -1) > -1} size="small" />
                {option.label}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <DateTimeRangePicker
        disableFuture
        sx={{ mb: 1 }}
        slotProps={{
          fieldSeparator: {
            fontWeight: 700,
            color: 'primary.main',
            sx: {
              mr: '-8px !important',
              ml: '8px !important',
            },
          },
          textField: {
            InputLabelProps: {
              size: 'small',
              sx: {
                mt: '2px',
                fontSize: 14,
                fontWeight: 700,
                color: 'primary.main',
              },
            },
            inputProps: {
              sx: {
                height: 32,
                pl: 2,
                pr: 0.5,
                py: 0.75,
                fontSize: 14,
                fontWeight: 700,
                color: 'primary.main',
              },
            },
          },
          actionBar: {
            actions: ['today', 'accept', 'cancel', 'clear'],
          },
        }}
        value={[searchParamsAfter ? dayjs(searchParamsAfter) : null, searchParamsBefore ? dayjs(searchParamsBefore) : null]}
        onChange={([after, before]) => {
          onChange(searchParamsChanges ?? [], after?.toISOString() ?? null, before?.toISOString() ?? null)
        }}
      />
    </Stack>
  )
}
