import { Trans, t } from '@lingui/macro'
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  formLabelClasses,
} from '@mui/material'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import { useState } from 'react'
import { WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'
import { allHistoryChangesOptions } from './utils/allHistoryChangesOptions'

interface InventoryFormChangeValueProps {
  searchParamsChanges: string[]
  searchParamsAfter: string | null
  searchParamsBefore: string | null
  onChange: (searchParamsChanges: string[], searchParamsAfter: string | null, searchParamsBefore: string | null) => void
}

const getOptionsLabel = (option: WorkspaceInventorySearchTableHistoryChanges) => {
  switch (option) {
    case 'node_compliant':
      return [t`Security`, t`Compliant`]
    case 'node_vulnerable':
      return [t`Security`, t`Vulnerable`]
    case 'node_created':
      return [t`Resource`, t`Created`]
    case 'node_updated':
      return [t`Resource`, t`Updated`]
    case 'node_deleted':
      return [t`Resource`, t`Deleted`]
  }
  return option
}

const getOptions = () =>
  allHistoryChangesOptions.map((value) => {
    const [group, label] = getOptionsLabel(value)
    return { value, label, group }
  })

const getGroupsWithOptions = () => {
  const options = getOptions()
  const groupsWithOptionsObj = options.reduce(
    (prev, option) => {
      const { group, ...item } = option
      return { ...prev, [group]: [...(prev[group] ?? []), item] }
    },
    {} as Record<string, { label: string; value: string }[]>,
  )
  return [options, Object.entries(groupsWithOptionsObj).map(([group, options]) => ({ group, options }))] as const
}

export const InventoryFormChangeValue = ({
  onChange,
  searchParamsAfter,
  searchParamsBefore,
  searchParamsChanges,
}: InventoryFormChangeValueProps) => {
  const [options, groupsWithOptions] = getGroupsWithOptions()
  const [rangePosition, setRangePosition] = useState<'start' | 'end'>(searchParamsAfter ? 'end' : 'start')
  const allIsSelected = searchParamsChanges.length === allHistoryChangesOptions.length
  return (
    <Stack width="100%" flexGrow={1} direction="row" flexWrap="wrap" overflow="auto" mt={-2} pt={2} mb={-1}>
      <FormControl>
        <InputLabel
          id="change-type"
          color="primary"
          sx={{
            color: 'primary.main',
            fontSize: 14,
            fontWeight: 700,
            transition: ({ transitions }) => transitions.create(['margin-top', 'color', 'transform', 'max-width'], { duration: 200 }),
            mt: '-5px',
            [`&.${formLabelClasses.filled},&.${formLabelClasses.focused}`]: { mt: '2px' },
          }}
        >
          <Trans>Change Type</Trans>
        </InputLabel>
        <Select
          sx={{
            fontSize: 14,
            minWidth: 200,
            mr: 1,
            '& svg': {
              color: 'primary.main',
            },
          }}
          size="small"
          value={searchParamsChanges}
          multiple
          variant="outlined"
          onChange={(e) => {
            onChange(typeof e.target.value === 'string' ? [e.target.value] : e.target.value, searchParamsAfter, searchParamsBefore)
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
                    py: 1.5,
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
          autoFocus={!searchParamsChanges}
          labelId="change-type"
        >
          {groupsWithOptions.map(({ group, options }, index) => [
            <ListSubheader key={index}>{group}</ListSubheader>,
            ...options.map(({ label, value: optionValue }, optionIndex) => (
              <MenuItem value={optionValue} dense key={`${index}_${optionIndex}`}>
                <Checkbox checked={(searchParamsChanges.indexOf(optionValue) ?? -1) > -1} size="small" />
                {label}
              </MenuItem>
            )),
          ])}
          <Divider />
          <Stack direction="row" justifyContent="end" px={1}>
            {
              <Button
                variant="outlined"
                color={allIsSelected ? 'error' : 'primary'}
                size="small"
                onClick={() => onChange(allIsSelected ? [] : [...allHistoryChangesOptions], searchParamsAfter, searchParamsBefore)}
              >
                {allIsSelected ? <Trans>Clear</Trans> : <Trans>Select All</Trans>}
              </Button>
            }
          </Stack>
        </Select>
      </FormControl>
      <DateTimeRangePicker
        disableFuture
        closeOnSelect
        rangePosition={rangePosition}
        onRangePositionChange={setRangePosition}
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
          if (after && !before) {
            setRangePosition('end')
          } else {
            setRangePosition('start')
          }
          onChange(
            searchParamsChanges?.length ? searchParamsChanges : [...allHistoryChangesOptions],
            after?.toISOString() ?? null,
            before?.toISOString() ?? null,
          )
        }}
      />
    </Stack>
  )
}
