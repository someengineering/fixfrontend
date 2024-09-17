import { LoadingButton } from '@mui/lab'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'

interface UserSettingsFormContentContainerProps extends PropsWithChildren {
  title: ReactNode
  isLoading?: boolean
  isPending?: boolean
  onSubmit: () => void
  buttonContent: ReactNode
  buttonDisabled?: boolean
}

export const UserSettingsFormContentContainer = ({
  title,
  isLoading,
  onSubmit,
  children,
  isPending,
  buttonContent,
  buttonDisabled,
}: UserSettingsFormContentContainerProps) => {
  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      alignItems="center"
    >
      <Box width={150}>
        <Typography>{title}:</Typography>
      </Box>
      <Stack gap={1} width={{ xs: '100%', lg: 400 }}>
        {isLoading ? (
          <Skeleton variant="rounded" width="100%">
            {children}
          </Skeleton>
        ) : (
          children
        )}
      </Stack>
      <LoadingButton type="submit" variant="contained" loading={isPending} disabled={isLoading || isPending || buttonDisabled}>
        {buttonContent}
      </LoadingButton>
    </Stack>
  )
}
