import { t } from '@lingui/macro'
import {
  alpha,
  MenuItem as MuiMenuItem,
  Select,
  selectClasses,
  Stack,
  stackClasses,
  styled,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState, useTransition } from 'react'
import { KeyboardArrowDownIcon, MeetingRoomIcon, TickSmallIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'

interface WorkspaceMenuItemProps {
  id: string
  name: string
  selectedWorkspace?: boolean
  error?: string
  handleSelectWorkspace: (id: string) => void
}

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  padding: theme.spacing(1.875, 1.5),
  margin: theme.spacing(0, 1.5),
  borderRadius: '6px',
  color: theme.palette.common.black,
}))

const WorkspaceMenuItem = ({ id, name, selectedWorkspace, error, handleSelectWorkspace }: WorkspaceMenuItemProps) => {
  const menuItem = (
    <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
      <Typography
        textAlign="center"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        variant="subtitle1"
        color={selectedWorkspace ? 'primary.main' : error ? 'textDisabled' : undefined}
        fontWeight={selectedWorkspace ? 500 : undefined}
      >
        {name}
      </Typography>
      {selectedWorkspace ? <TickSmallIcon color="primary.main" /> : null}
    </Stack>
  )
  return error ? (
    <Tooltip title={error} placement="right" arrow>
      <MenuItem
        sx={{
          cursor: 'default',
          ':hover': {
            bgcolor: 'transparent',
          },
        }}
        value={id}
      >
        {menuItem}
      </MenuItem>
    </Tooltip>
  ) : (
    <MenuItem
      onClick={selectedWorkspace ? undefined : () => handleSelectWorkspace(id)}
      selected={selectedWorkspace}
      disabled={selectedWorkspace}
      sx={{
        opacity: selectedWorkspace ? '1!important' : undefined,
        ':hover': {
          bgcolor: alpha(panelUI.uiThemePalette.primary.purple, 0.08),
        },
      }}
      value={id}
    >
      {menuItem}
    </MenuItem>
  )
}

export const WorkspacesButton = () => {
  const [open, setOpen] = useState(false)
  const { workspaces, selectedWorkspace, selectWorkspace } = useUserProfile()
  const navigate = useAbsoluteNavigate()
  const [isPending, startTransition] = useTransition()

  const handleSelectWorkspace = (id: string) => {
    setOpen(false)
    startTransition(() => {
      selectWorkspace(id).then((workspace) => {
        if (workspace?.id) {
          window.setTimeout(() => {
            navigate({ pathname: panelUI.homePage, hash: `#${workspace.id}`, search: '' }, { replace: true })
          })
        }
      })
    })
  }

  return (
    <>
      {isPending ? <FullPageLoadingSuspenseFallback forceFullPage /> : null}
      <Select
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        labelId="select-workspace-label"
        id="select-workspace"
        value={selectedWorkspace?.id}
        renderValue={() => (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <MeetingRoomIcon color={open ? 'primary.main' : undefined} />
            <Typography variant="button" color={open ? 'primary.main' : undefined}>
              {selectedWorkspace?.name}
            </Typography>
          </Stack>
        )}
        inputProps={{
          sx: {
            padding: ({ spacing }: Theme) => `${spacing(0, 7.5, 0, 2)}!important`,
            minHeight: 'auto!important',
            height: '100%!important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: -5,
            [`.${stackClasses.root} svg`]: open
              ? {
                  fill: ({ palette }: Theme) => palette.primary.main,
                }
              : undefined,
          },
        }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                borderRadius: '12px',
              },
            },
            root: {
              slotProps: {
                backdrop: {
                  sx: {
                    bgcolor: 'transparent',
                  },
                },
              },
            },
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          input: {
            display: 'none',
          },
          fieldset: {
            display: 'none',
          },
          [`svg.${selectClasses.icon}`]: {
            position: 'static',
            top: 'initial',
            right: 'initial',
            mr: 2,
            fill: open ? ({ palette }) => palette.primary.main : undefined,
          },
        }}
        IconComponent={KeyboardArrowDownIcon}
      >
        <MenuItem value={selectedWorkspace?.id} sx={{ display: 'none' }}>
          <em>None</em>
        </MenuItem>
        {workspaces?.map(({ name, id, permissions, user_has_access }) => (
          <WorkspaceMenuItem
            key={id}
            id={id}
            handleSelectWorkspace={handleSelectWorkspace}
            name={name}
            selectedWorkspace={selectedWorkspace?.id === id}
            error={
              permissions.includes('read') && user_has_access
                ? undefined
                : t`You don't have the permission to view this workspace, contact the workspace owner for more information.`
            }
          />
        ))}
      </Select>
    </>
  )
}
