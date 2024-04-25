import { Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormMorePopover } from './InventoryFormMorePopover'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

export const InventoryFormMore = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const {
    update: {
      current: { setPredicate },
    },
  } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  return (
    <>
      <Box pt={1} pr={1} height="100%">
        <Button
          onClick={(e) => setOpen(e.currentTarget)}
          component={Stack}
          variant="outlined"
          boxShadow={4}
          direction="row"
          bgcolor="primary.main"
          spacing={0.5}
          pr="4px !important"
          alignItems="center"
          sx={{ textTransform: 'none', minHeight: 42 }}
          endIcon={
            <IconButton size="small">
              <AddIcon fontSize="small" />
            </IconButton>
          }
        >
          <Stack>
            <Typography color="common.black" variant="body2" fontWeight={700} p={0} width="100%" textAlign="left" whiteSpace="nowrap">
              <Trans>More</Trans>
            </Typography>
          </Stack>
        </Button>
      </Box>
      <InventoryFormMorePopover
        onChange={(term) => {
          if (term) {
            setPredicate(term.path.toString(), term.op, term.value)
          }
        }}
        onClose={() => setOpen(null)}
        open={open}
        preItems={preItems}
        id={-1}
      />
    </>
  )
}
