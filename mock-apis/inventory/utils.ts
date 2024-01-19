// eslint-disable-next-line no-restricted-imports
import { model } from '../data'

export const getKindsFromModel = (baseKind: string, kindsSoFar: string[]): unknown[] => {
  const base = model.find((j: { fqn: string }) => j.fqn === baseKind) as {
    fqn: string
    properties: Record<string, { kind: { type: string; fqn: string; items: { type: string; fqn: string } } }>
  }
  const data = Object.values(base.properties)
    .map((i) =>
      i.kind.type === 'object' ? i.kind.fqn : i.kind.type === 'array' && i.kind.items.type === 'object' ? i.kind.items.fqn : undefined,
    )
    .filter((i) => i && !kindsSoFar.includes(i))
    .map((i) => getKindsFromModel(i as string, [baseKind, ...kindsSoFar]))
    .flat()

  return [base, ...data]
}
