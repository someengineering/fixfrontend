import { Box, Button, Typography } from '@mui/material'
import { FallbackProps } from 'react-error-boundary'

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Box display="flex" flexDirection="column" p={2}>
      <Typography color="error">{error.message}</Typography>
      <Button onClick={resetErrorBoundary} variant="contained" sx={{ mt: 1 }} color="warning">
        Reset
      </Button>
    </Box>
  )
}
