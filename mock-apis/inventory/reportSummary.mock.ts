/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { workspaceReportSummary } from '../data'
import { responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // report-summary
  url: '/api/workspaces/:workspaceId/inventory/report-summary',
  method: 'GET',
  response: responseJSONWithAuthCheck(workspaceReportSummary),
})
