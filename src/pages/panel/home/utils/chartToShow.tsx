import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { HeatmapCard } from './HeatmapCard'
import { PieCard } from './PieCard'
import { StackBarCard } from './StackBarCard'

export const chartToShow = (data?: GetWorkspaceInventoryReportSummaryResponse) => {
  if (data) {
    const benchmarksLength = data.benchmarks.length
    const accountLength = data.accounts.length
    if (accountLength && benchmarksLength) {
      if (
        (benchmarksLength === 2 && accountLength > 8) ||
        (benchmarksLength > 2 && benchmarksLength < 5 && accountLength > 4) ||
        (benchmarksLength > 4 && benchmarksLength < 9 && accountLength > 2) ||
        (benchmarksLength > 8 && accountLength > 1)
      ) {
        return <HeatmapCard data={data} />
      } else if (
        (benchmarksLength === 1 && accountLength > 8) ||
        (benchmarksLength === 2 && accountLength > 4 && accountLength < 9) ||
        (benchmarksLength > 2 && benchmarksLength < 5 && accountLength > 2 && accountLength < 5) ||
        (benchmarksLength > 4 && benchmarksLength < 9 && accountLength === 2) ||
        (benchmarksLength > 8 && accountLength === 1)
      ) {
        return <StackBarCard data={data} />
      }
      return <PieCard data={data} />
    }
  }
  return null
}
