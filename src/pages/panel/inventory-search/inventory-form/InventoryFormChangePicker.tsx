import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
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
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'
import { allHistoryChangesOptions } from './utils/allHistoryChangesOptions'

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

interface InventoryFormChangePickerProps {
  searchParamsChanges: string[]
  searchParamsAfter: string | null
  searchParamsBefore: string | null
  onChange: (searchParamsChanges: string[], searchParamsAfter: string | null, searchParamsBefore: string | null) => void
}

export const InventoryFormChangePicker = ({
  onChange,
  searchParamsAfter,
  searchParamsBefore,
  searchParamsChanges,
}: InventoryFormChangePickerProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const [options, groupsWithOptions] = useMemo(getGroupsWithOptions, [locale])
  const [value, setValue] = useState(searchParamsChanges)
  const prevSearchParamsChanges = useRef(searchParamsChanges)
  useEffect(() => {
    setValue(searchParamsChanges)
  }, [searchParamsChanges])
  const debouncedValue = useDebounce(value, panelUI.inputChangeDebounce)
  useEffect(() => {
    if (
      prevSearchParamsChanges.current === searchParamsChanges &&
      JSON.stringify(debouncedValue.sort((a, b) => a.localeCompare(b))) !==
        JSON.stringify(searchParamsChanges.sort((a, b) => a.localeCompare(b)))
    ) {
      onChange(debouncedValue, searchParamsAfter, searchParamsBefore)
    } else {
      prevSearchParamsChanges.current = searchParamsChanges
    }
  }, [debouncedValue, onChange, searchParamsAfter, searchParamsBefore, searchParamsChanges])
  const allIsSelected = value.length === allHistoryChangesOptions.length
  return (
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
        value={value}
        multiple
        variant="outlined"
        onChange={(e) => {
          setValue(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)
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
        autoFocus={!value}
        labelId="change-type"
      >
        {groupsWithOptions.map(({ group, options }, index) => [
          <ListSubheader key={index}>{group}</ListSubheader>,
          ...options.map(({ label, value: optionValue }, optionIndex) => (
            <MenuItem value={optionValue} dense key={`${index}_${optionIndex}`}>
              <Checkbox checked={(value.indexOf(optionValue) ?? -1) > -1} size="small" />
              {label}
            </MenuItem>
          )),
        ])}
        <Divider />
        <Stack direction="row" justifyContent="end" px={1} spacing={1}>
          {value.length ? (
            <Button variant="outlined" color="error" size="small" onClick={() => setValue([])}>
              {<Trans>Clear</Trans>}
            </Button>
          ) : null}
          {!allIsSelected ? (
            <Button variant="outlined" color="primary" size="small" onClick={() => setValue([...allHistoryChangesOptions])}>
              {<Trans>Select All</Trans>}
            </Button>
          ) : null}
        </Stack>
      </Select>
    </FormControl>
  )
}
