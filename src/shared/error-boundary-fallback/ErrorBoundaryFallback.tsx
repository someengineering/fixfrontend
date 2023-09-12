import { FallbackProps } from 'react-error-boundary'

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return <>{error.message}</>
}
