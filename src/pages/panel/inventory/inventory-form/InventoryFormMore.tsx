import { t } from '@lingui/macro'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CloudCircleOutlinedIcon from '@mui/icons-material/CloudCircleOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined'
import SouthAmericaOutlinedIcon from '@mui/icons-material/SouthAmericaOutlined'
import { Fab, Popover, Stack, SvgIcon, Tooltip, Typography, backdropClasses } from '@mui/material'
import { useState } from 'react'
import { panelUI } from 'src/shared/constants'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { InventoryFormCloudValues } from './InventoryFormCloudValues'
import { InventoryFormMoreValue } from './InventoryFormMoreValue'
import { InventoryFormRegionValues } from './InventoryFormRegionValues'
import { InventoryFormTagsValue } from './InventoryFormTagsValue'
import { AutoCompletePreDefinedItems } from './utils/getAutoCompleteFromKey'

const InventoryFormMoreFab = ({
  label,
  Icon,
  onClick,
}: {
  label: string
  Icon: typeof SvgIcon
  onClick: (el: HTMLButtonElement) => void
}) => {
  return (
    <Fab
      color="primary"
      aria-label={label}
      onClick={(e) => onClick(e.currentTarget)}
      size="small"
      variant="extended"
      sx={{
        boxShadow: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon />
        <Typography fontWeight={700} fontSize={12}>
          {label}
        </Typography>
      </Stack>
    </Fab>
  )
}

export const InventoryFormMore = ({ preItems }: { preItems: AutoCompletePreDefinedItems }) => {
  const { setPredicate } = useFixQueryParser()
  const [open, setOpen] = useState<HTMLDivElement | null>(null)
  const [openClouds, setOpenClouds] = useState<HTMLDivElement | null>(null)
  const [openRegions, setOpenRegions] = useState<HTMLDivElement | null>(null)
  const [openTags, setOpenTags] = useState<HTMLDivElement | null>(null)
  const [openProperty, setOpenProperty] = useState<HTMLDivElement | null>(null)
  const openFab = (openFabPopover: (el: HTMLDivElement) => void) => () => {
    if (open) {
      setOpen(null)
      openFabPopover(open)
    }
  }
  return (
    <>
      <Stack height="auto" justifyContent="center" position="relative">
        <Tooltip title={t`Add Filter`}>
          <Fab color="success" aria-label="add" onClick={(e) => setOpen(e.currentTarget)} component={Stack} boxShadow={4} size="small">
            <AddCircleOutlineIcon fontSize="small" />
          </Fab>
        </Tooltip>
        <Popover
          onClose={() => setOpen(null)}
          open={!!open}
          anchorEl={open}
          slotProps={{
            paper: { sx: { background: 'transparent', boxShadow: 0 } },
          }}
          sx={{
            [`& .${backdropClasses.root}`]: { bgcolor: 'transparent' },
            maxHeight: `calc(100% - ${(open?.offsetTop ?? 0) + (open?.offsetHeight ?? 0) + panelUI.headerHeight}px)`,
          }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <Stack spacing={1} alignItems="start" p={2}>
            <InventoryFormMoreFab Icon={CloudCircleOutlinedIcon} onClick={openFab(setOpenClouds)} label={t`Cloud`} />
            <InventoryFormMoreFab Icon={SouthAmericaOutlinedIcon} onClick={openFab(setOpenRegions)} label={t`Region`} />
            <InventoryFormMoreFab Icon={LocalOfferOutlinedIcon} onClick={openFab(setOpenTags)} label={t`Tags`} />
            <InventoryFormMoreFab Icon={OtherHousesOutlinedIcon} onClick={openFab(setOpenProperty)} label={t`Properties`} />
          </Stack>
        </Popover>
      </Stack>
      <InventoryFormCloudValues onClose={() => setOpenClouds(null)} open={openClouds} preItems={preItems} withAddButton />
      <InventoryFormRegionValues onClose={() => setOpenRegions(null)} open={openRegions} preItems={preItems} withAddButton />
      <InventoryFormTagsValue
        onChange={(term) => {
          if (term) {
            setPredicate(term.path.toString(), term.op, term.value)
          }
        }}
        onClose={() => setOpenTags(null)}
        open={openTags}
        preItems={preItems}
        id={5}
      />
      <InventoryFormMoreValue
        onChange={(term) => {
          if (term) {
            setPredicate(term.path.toString(), term.op, term.value)
          }
        }}
        onClose={() => setOpenProperty(null)}
        open={openProperty}
        preItems={preItems}
        id={6}
      />
    </>
  )
}
