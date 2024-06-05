import { Box } from '@mui/material'
import { Spinner } from './Spinner'

interface LoadingProps {
  width?: number
}

export const LoadingSuspenseFallback = ({ width }: LoadingProps) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" minHeight={150} minWidth={150} flexGrow={1}>
      <Spinner isLoading width={width} withBackground />
    </Box>
  )
}
