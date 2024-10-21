import { Trans } from '@lingui/macro'
import { Box, BoxProps, Button, ButtonProps, IconButton, Stack, StackProps, Typography, TypographyProps } from '@mui/material'
import { useState } from 'react'
import { CopyAllIcon, VisibilityIcon, VisibilityOffIcon } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { useCopyString } from 'src/shared/utils/useCopyString'

interface SecretFieldProps {
  secret?: string
  numberOfCharacter?: number
  slotProps?: {
    containerStack?: StackProps
    typographyContainerBox?: BoxProps
    typography?: TypographyProps
    copyButtonContainerBox?: BoxProps
    copyButton?: ButtonProps
  }
}

export const SecretField = ({
  secret,
  numberOfCharacter,
  slotProps: { containerStack, copyButton, copyButtonContainerBox, typographyContainerBox, typography } = {},
}: SecretFieldProps) => {
  const [showSecret, setShowSecret] = useState(false)
  const copyString = useCopyString()
  const handleCopy = () => {
    if (secret) {
      copyString(secret)
    }
  }
  const handleToggleShowSecret = () => {
    setShowSecret((prev) => !prev)
  }
  return (
    <Stack direction="row" spacing={1} {...containerStack}>
      <Box
        display="inline-flex"
        border={`1px solid ${panelUI.uiThemePalette.input.border}`}
        borderRadius="6px"
        alignItems="center"
        justifyContent="space-between"
        {...typographyContainerBox}
      >
        <Typography
          variant="h6"
          fontFamily="Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"
          p={{ xs: 1, md: 2 }}
          whiteSpace="nowrap"
          fontSize={{ xs: 12, md: 'initial' }}
          {...typography}
        >
          {showSecret ? secret : new Array(secret?.length ?? numberOfCharacter ?? 12).fill('X')}
        </Typography>
        <IconButton onClick={handleToggleShowSecret}>{showSecret ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
      </Box>
      <Box ml={2} alignSelf={{ xs: 'end', md: 'stretch' }} {...copyButtonContainerBox}>
        <Button
          variant="contained"
          startIcon={<CopyAllIcon />}
          onClick={handleCopy}
          sx={{ height: { xs: 'auto', md: '100%' } }}
          {...copyButton}
        >
          <Trans>Copy</Trans>
        </Button>
      </Box>
    </Stack>
  )
}
