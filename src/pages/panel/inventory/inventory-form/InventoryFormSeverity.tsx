import { t } from '@lingui/macro'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { DefaultPropertiesKeys, useFixQueryParser } from 'src/shared/fix-query-parser'
import { SeverityType } from 'src/shared/types/server'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { InventoryFormField } from './InventoryFormField'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormSeverity = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const {
    severity,
    update: {
      current: { setPredicate, deletePredicate },
    },
  } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const values = termValueToStringArray(severity?.value)
  const severityOptions = useMemo(() => {
    const valuesToAdd = [...values]
    const result = [...preItems.severities]
    for (const severity of preItems.severities) {
      let index = valuesToAdd.indexOf(severity.value)
      if (index === -1) {
        index = valuesToAdd.indexOf(severity.label)
      }
      if (index > -1) {
        valuesToAdd.splice(index, 1)
      }
    }
    valuesToAdd.forEach((value) => result.push({ label: value, value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.severities])
  return (
    <>
      <InventoryFormField
        value={severity}
        label={t`Severities`}
        onClick={(e) => setOpen(e.currentTarget)}
        onClear={() => deletePredicate(DefaultPropertiesKeys.Severity)}
        // endIcon={open ? <ArrowDropUpIcon fontSize="small" color="disabled" /> : <ArrowDropDownIcon fontSize="small" color="disabled" />}
      />
      <InventoryFormDefaultValue
        onChange={(values) =>
          values.length ? setPredicate(DefaultPropertiesKeys.Severity, 'in', values) : deletePredicate(DefaultPropertiesKeys.Severity)
        }
        values={values}
        label={t`Severity`}
        showItemLabel={(item) => (
          <Typography color={getColorBySeverity(item.value as SeverityType)} component="span">
            {item.label}
          </Typography>
        )}
        labelPlural={t`Severities`}
        onClose={() => setOpen(null)}
        open={open}
        options={severityOptions}
      />
    </>
  )
}
