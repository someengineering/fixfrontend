import { AllTerm, CombinedTerm, ContextTerm, FulltextTerm, IdTerm, IsTerm, NotTerm, Predicate, Term } from './query'

export function escapeQuotes(value: string): string {
  return value.replace(/(?<!\\)"/g, '\\"')
}
export function jsonElementToString<WithArrayString extends boolean>(
  value: unknown,
  withArrayString: WithArrayString,
): WithArrayString extends true ? string[] | string : string {
  return (
    typeof value === 'string'
      ? value
      : Array.isArray(value)
        ? withArrayString
          ? value.map((item) => jsonElementToString(item, false))
          : value.map((item) => jsonElementToString(item, false)).join(', ')
        : JSON.stringify(value)
  ) as WithArrayString extends true ? string | string[] : string
}

export function jsonElementToNumber<WithArrayNumber extends boolean>(
  value: unknown,
  withArrayNumber: WithArrayNumber,
): WithArrayNumber extends true ? (number | string | null)[] | number | null : number | string | null {
  const numberedValue = typeof value === 'string' ? Number(value) : value
  const numberedValueIsCorrect = typeof numberedValue === 'number' && !Number.isNaN(numberedValue)
  return (
    typeof value === 'number'
      ? value
      : numberedValueIsCorrect
        ? numberedValue
        : Array.isArray(value)
          ? withArrayNumber
            ? value.map((item) => jsonElementToNumber(item, false))
            : JSON.stringify(value.map((item) => jsonElementToNumber(item, false)))
          : null
  ) as WithArrayNumber extends true ? (number | string | null)[] | number | null : number | string | null
}

export function termValueToString<WithArrayString extends boolean>(
  term: Term,
  withArrayString: WithArrayString,
): WithArrayString extends true ? string[] | string : string {
  return (
    term instanceof Predicate
      ? jsonElementToString<WithArrayString>(term.value, withArrayString)
      : term instanceof FulltextTerm
        ? term.text
        : term instanceof AllTerm
          ? 'all'
          : term instanceof NotTerm
            ? `not ${termValueToString(term.term, false)}`
            : term instanceof ContextTerm
              ? termValueToString<WithArrayString>(term.term, withArrayString)
              : term instanceof CombinedTerm
                ? `${termValueToString(term.left, false)} ${term.op} ${termValueToString(term.right, false)}`
                : term instanceof IdTerm
                  ? withArrayString
                    ? term.ids
                    : term.ids.join(', ')
                  : term instanceof IsTerm
                    ? withArrayString
                      ? term.kinds
                      : term.kinds.join(', ')
                    : ''
  ) as WithArrayString extends true ? string | string[] : string
}
