import { t } from '@lingui/macro'
import { OPType } from 'src/shared/fix-query-parser'

export const getOpTypeLabel = (op: OPType) => {
  switch (op) {
    case 'in':
      return t`Include`
    case 'not in':
      return t`Not include`
    case '=':
      return t`Equal`
    case '!=':
      return t`Not equal`
    case '>':
      return t`Greater than`
    case '>=':
      return t`Greater than or equal`
    case '<':
      return t`Less than`
    case '<=':
      return t`Less than or equal`
    case '~':
      return t`Have`
    case '!~':
      return t`Not Have`
  }
}
