import { Trans, t } from '@lingui/macro'
import { Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack, alpha } from '@mui/material'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'

interface InventoryFormChangeValueProps {
  searchParamsChanges: string[] | null
  searchParamsAfter: string | null
  searchParamsBefore: string | null
  onChange: (searchParamsChanges: string[], searchParamsAfter: string | null, searchParamsBefore: string | null) => void
}

const getOptions = () => [
  {
    label: t`Node Created`,
    value: 'node_created',
  },
  {
    label: t`Node Updated`,
    value: 'node_updated',
  },
  {
    label: t`Node Deleted`,
    value: 'node_deleted',
  },
  {
    label: t`Node Vulnerable`,
    value: 'node_vulnerable',
  },
  {
    label: t`Node Compliant`,
    value: 'node_compliant',
  },
]

export const InventoryFormChangeValue = ({
  onChange,
  searchParamsAfter,
  searchParamsBefore,
  searchParamsChanges,
}: InventoryFormChangeValueProps) => {
  const options = getOptions()
  return (
    <Stack width="100%" flexGrow={1} direction="row" flexWrap="wrap" gap={1} overflow="auto" pt={1} mt={-1}>
      <FormControl>
        <InputLabel id="change-type" color="primary" sx={{ color: 'primary.main', mt: '2px', fontSize: 14, fontWeight: 700 }}>
          <Trans>Change Type</Trans>
        </InputLabel>
        <Select
          sx={{
            fontSize: 14,
            minWidth: 200,
            mb: 1,
            mr: 1,
            height: '100%',
            '& fieldset': {
              borderColor: ({ palette }) => alpha(palette.primary.main, 0.5),
              borderStyle: 'solid',
              borderWidth: 1,
              boxShadow: 3,
              borderRadius: 1,
            },
            '& svg': {
              color: 'primary.main',
            },
          }}
          value={searchParamsChanges ?? []}
          multiple
          variant="outlined"
          onChange={(e) =>
            onChange(typeof e.target.value === 'string' ? [e.target.value] : e.target.value, searchParamsAfter, searchParamsBefore)
          }
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
          renderValue={(selected) => selected.map((item) => options.find((option) => option.value === item)?.label ?? item).join(', ')}
          size="small"
          autoFocus={!searchParamsChanges}
          labelId="change-type"
        >
          {options.map((option, index) => (
            <MenuItem value={option.value} dense key={index}>
              <Checkbox checked={(searchParamsChanges?.indexOf(option.value) ?? -1) > -1} size="small" />
              {option.label}
            </MenuItem>
          ))}
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
            actions: ['today', 'accept', 'cancel'],
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
