import { t } from '@lingui/macro'
import { NavigateFunction } from 'react-router-dom'
import { FailedChecksType, WorkspaceAccountReportSummary } from 'src/shared/types/server'
import { numberToReadableNumber } from 'src/shared/utils/numberToReadable'
import { wordToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
import { createInventorySearchTo } from './createInventorySearchTo'

const createPieDataFromName = (
  name: 'critical' | 'high' | 'medium' | 'low' | 'info',
  accountFailedResources: Partial<FailedChecksType<number>> | null,
  resourceCount: number,
  locale: string,
  navigate: NavigateFunction,
  accountId: string,
  noTooltip?: boolean,
  noOnclick?: boolean,
) => {
  const accountFailedResource = accountFailedResources?.[name]
  const label = wordToUFStr(name)
  return {
    value: accountFailedResource ?? 0,
    name: label,
    label: typeof accountFailedResource === 'number' ? numberToReadableNumber({ value: accountFailedResource, locale }) : undefined,
    description: noTooltip
      ? undefined
      : t`${label.toString()}: We've identified ${
          accountFailedResource?.toLocaleString(locale) ?? '0'
        } non-compliant resources out of ${resourceCount?.toLocaleString(locale)}.`,
    onClick: noOnclick
      ? undefined
      : () => {
          navigate(
            createInventorySearchTo(
              `/security.has_issues=true and /ancestors.account.reported.id="${accountId}" and /security.issues[*].severity=${name}`,
            ),
          )
        },
  }
}

export const createPieDataFromNonCompliance = (
  account: WorkspaceAccountReportSummary,
  locale: string,
  navigate: NavigateFunction,
  noTooltip?: boolean,
  noOnclick?: boolean,
) => {
  return (['critical', 'high', 'medium', 'low', 'info'] as const).map((name) =>
    createPieDataFromName(
      name,
      account.failed_resources_by_severity,
      account.resource_count,
      locale,
      navigate,
      account.id,
      noTooltip,
      noOnclick,
    ),
  )
}
