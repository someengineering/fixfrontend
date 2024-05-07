import { t } from '@lingui/macro'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { useFixQueryParser } from 'src/shared/fix-query-parser'

export const InventoryFormReset = () => {
  const {
    q,
    update: {
      current: { reset },
    },
  } = useFixQueryParser()
  return q && q !== 'all' ? (
    <Stack pt={1} pr={1} order={1} alignSelf="stretch" alignItems="end" flexGrow={1}>
      <Tooltip title={t`Clear the search`}>
        <IconButton onClick={reset} color="info" sx={{ height: 42, boxShadow: 4 }}>
          <HighlightOffIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  ) : null
}
