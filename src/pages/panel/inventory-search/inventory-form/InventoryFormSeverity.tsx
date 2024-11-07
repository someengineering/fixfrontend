import { t } from '@lingui/macro'
import { Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { DefaultPropertiesKeys, useFixQueryParser } from 'src/shared/fix-query-parser'
import { SeverityType } from 'src/shared/types/server-shared'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { InventoryFormDefaultValue } from './InventoryFormDefaultValue'
import { InventoryFormField } from './InventoryFormField'
import { termValueToStringArray } from './utils'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormSeverity = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { severity, setPredicate, deletePredicate } = useFixQueryParser()
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
    valuesToAdd.forEach((value) => result.push({ label: value, value, id: value }))
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), preItems.severities])

  const handleChange = useCallback(
    (values: string[]) =>
      values.length ? setPredicate(DefaultPropertiesKeys.Severity, 'in', values) : deletePredicate(DefaultPropertiesKeys.Severity),
    [deletePredicate, setPredicate],
  )

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
        onChange={handleChange}
        values={values}
        label={t`Severity`}
        showItemLabel={(item) => (
          <Typography color={getColorBySeverity(item.value as SeverityType)} component="span">
            {snakeCaseToUFStr(item.label)}
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
