import { BenchmarkCheckResultNode } from 'src/shared/types/server'
import { ComplianceCheckCollectionNodeWithChildren } from './ComplianceDetailTreeItem'

export const getAllChildrenCheckResult = (
  child?: ComplianceCheckCollectionNodeWithChildren[],
): (BenchmarkCheckResultNode & { checkId: string })[] =>
  child
    ?.map((i) =>
      i.reported.kind === 'report_check_result'
        ? { ...i.reported, id: i.nodeId, checkId: i.reported.id }
        : getAllChildrenCheckResult(i.children),
    )
    .flat()
    .filter((i) => i) ?? []
