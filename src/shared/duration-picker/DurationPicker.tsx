import { Autocomplete, TextField } from '@mui/material'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import {
  ISO8601DurationType,
  durationToCustomDurationString,
  iso8601DurationToString,
  parseCustomDuration,
  splitCustomDuration,
  splittedCustomDurationToAutoComplete,
} from 'src/shared/utils/parseDuration'

interface DurationPickerProps {
  value: string
  onChange: (value: string) => void
}

const getAllDuration = (num: number) =>
  ({
    years: num,
    months: num,
    weeks: num,
    days: num,
    hours: num,
    minutes: num,
    seconds: num,
    duration: 0,
    negative: false,
  }) as ISO8601DurationType

const customDurationDict = ['yr', 'mo', 'w', 'd', 'h', 'min', 's']
const allPossibleValues = [
  'years',
  'year',
  'months',
  'month',
  'weeks',
  'week',
  'days',
  'day',
  'hours',
  'hour',
  'minutes',
  'minute',
  'seconds',
  'second',
  ...customDurationDict,
]

const getOptions = ([num, dur]: [number, string]) => {
  let strs = iso8601DurationToString(getAllDuration(num), 7, true, '')
    .split('  ')
    .map((label, i) => ({
      label,
      value: `${num}${customDurationDict[i]}`,
    }))
  if (dur) {
    strs = strs.filter((_, i) => customDurationDict[i].includes(dur))
  }
  return num ? strs : []
}

const removeZeroValues = (duration: ISO8601DurationType) => {
  const newDuration = { ...duration }
  Object.entries(newDuration).forEach(([key, value]) => {
    if (!value) {
      delete newDuration[key]
    }
  })
  return newDuration as Partial<ISO8601DurationType>
}

export const DurationPicker = ({ onChange, value }: DurationPickerProps) => {
  const [typed, setTyped] = useState('')
  const parsedDuration = parseCustomDuration(value)
  const splittedValue = splitCustomDuration(durationToCustomDurationString(parsedDuration))
  const autoCompleteValue = splittedCustomDurationToAutoComplete(splittedValue)
  const index = /[^\d]/g.exec(typed)?.index
  const options = getOptions(
    index !== undefined ? [Number(typed.substring(0, index)), typed.substring(index)] : [Number(typed), ''],
  ).concat(autoCompleteValue)
  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: 250, maxWidth: '100%' }}
      options={options}
      value={autoCompleteValue}
      open={!!options.filter((i) => !autoCompleteValue.includes(i)).length}
      onChange={(_, newValues, reason) => {
        if ((reason !== 'selectOption' && reason !== 'createOption') || parseCustomDuration(newValues[newValues.length - 1].value)) {
          const reversedNewValues = newValues.reverse()
          onChange(
            customDurationDict
              .map((item) => reversedNewValues.find((option) => option.value.endsWith(item))?.value)
              .filter((i) => i)
              .join(''),
          )
        }
        setTyped('')
      }}
      filterOptions={(options) => options.filter((i) => !autoCompleteValue.includes(i))}
      multiple
      renderInput={(params) => (
        <TextField
          {...params}
          value={typed}
          inputProps={{
            ...params.inputProps,
            value: typed,
            onKeyDown: (e) => {
              if (e.key !== 'Backspace' || !typed) {
                params.inputProps.onKeyDown?.(e as KeyboardEvent<HTMLInputElement>)
              } else {
                e.stopPropagation()
              }
            },
            onChange: (e) => {
              const value = e.currentTarget.value
              const trimmed = value.trim().toLocaleLowerCase()
              const lowerCased = trimmed.toLowerCase()
              const foundDur = allPossibleValues.find((item) => lowerCased.endsWith(item))
              if (foundDur) {
                onChange(durationToCustomDurationString({ ...parsedDuration, ...removeZeroValues(parseCustomDuration(trimmed)) }))
              }
              if (foundDur || !/^\d/.test(value)) {
                setTyped('')
                params.inputProps.onChange?.({
                  ...(e as ChangeEvent<HTMLInputElement>),
                  currentTarget: {
                    ...(e.currentTarget as ChangeEvent<HTMLInputElement>['currentTarget']),
                    value: '',
                  },
                  target: {
                    ...(e.target as ChangeEvent<HTMLInputElement>['target']),
                    value: '',
                  },
                })
              } else {
                setTyped(value)
                params.inputProps.onChange?.(e as ChangeEvent<HTMLInputElement>)
              }
            },
          }}
        />
      )}
    />
  )
}
