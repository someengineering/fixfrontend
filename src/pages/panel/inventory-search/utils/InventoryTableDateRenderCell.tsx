import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Tooltip } from '@mui/material'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'

interface InventoryTableKindRenderCellProps {
  value: Date
}

export const InventoryTableDateRenderCell = ({ value }: InventoryTableKindRenderCellProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  return (
    <Tooltip title={`${value.toLocaleDateString(locale)} ${value.toLocaleTimeString(locale)}`} arrow>
      <span>
        <Trans>{iso8601DurationToString(diffDateTimeToDuration(new Date(), new Date(value)), 1).toLowerCase()} ago</Trans>
      </span>
    </Tooltip>
  )
}
