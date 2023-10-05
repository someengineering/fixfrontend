import { useLingui } from '@lingui/react'
import LanguageIcon from '@mui/icons-material/Language'
import { Box, IconButton, IconButtonProps, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { MouseEvent as MouseEventReact, useState } from 'react'
import { langs } from 'src/shared/constants'

interface LanguageButtonProps {
  iconButtonProps?: IconButtonProps
  whiteMode?: boolean
}

export const LanguageButton = ({ iconButtonProps, whiteMode }: LanguageButtonProps) => {
  const { i18n } = useLingui()
  const [anchorElLanguage, setAnchorElLanguage] = useState<HTMLElement>()
  const handleOpenUserMenu = (event: MouseEventReact<HTMLElement, MouseEvent>) => {
    setAnchorElLanguage(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElLanguage(undefined)
  }

  const handleSelectLanguage = (locale: string) => {
    handleCloseUserMenu()
    i18n.activate(locale)
  }

  return (
    <Box display="inline-flex" alignItems="center" justifyContent="center">
      <Tooltip title="Select Language">
        <IconButton
          sx={{ p: 0, color: whiteMode ? 'common.white' : 'primary', mr: 2 }}
          size="large"
          {...(iconButtonProps ?? {})}
          onClick={handleOpenUserMenu}
        >
          <LanguageIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="language-menu"
        anchorEl={anchorElLanguage}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElLanguage)}
        onClose={handleCloseUserMenu}
      >
        {langs?.map(({ IconWide, locale, title }) => (
          <MenuItem
            key={locale}
            onClick={locale === i18n.locale ? undefined : () => handleSelectLanguage(locale)}
            disabled={locale === i18n.locale}
          >
            <IconWide width={32} />
            <Typography ml={1}>{title}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
