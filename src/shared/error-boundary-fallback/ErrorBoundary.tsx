import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundaryProps, ErrorBoundary as OrigErrorBoundary } from 'react-error-boundary'

export const NetworkErrorBoundary = (props: ErrorBoundaryProps) => (
  <QueryErrorResetBoundary>{({ reset }) => <OrigErrorBoundary {...props} onReset={reset} />}</QueryErrorResetBoundary>
)
