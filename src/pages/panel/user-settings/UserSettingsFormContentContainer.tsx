import { LoadingButton } from '@mui/lab'
import { Skeleton, Stack, Typography } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'

interface UserSettingsFormContentContainerProps extends PropsWithChildren {
  title: ReactNode
  spacing?: number
  isLoading?: boolean
  isPending?: boolean
  onSubmit: () => void
  buttonContent: ReactNode
  buttonDisabled?: boolean
}

export const UserSettingsFormContentContainer = ({
  title,
  spacing,
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
      spacing={spacing ?? 1.5}
      justifyContent="center"
      maxWidth={618}
      width="100%"
    >
      <Typography variant="h6">{title}</Typography>
      {isLoading ? (
        <Skeleton variant="rounded" width="100%" height={44}>
          {children}
        </Skeleton>
      ) : (
        children
      )}
      <Stack alignItems="end">
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          loading={isPending}
          disabled={isLoading || isPending || buttonDisabled}
          sx={{ py: 1.5, px: 4, height: 44 }}
        >
          {buttonContent}
        </LoadingButton>
      </Stack>
    </Stack>
  )
}
