export const scoreToStaticColor = (score?: number) =>
  score ? (score <= 50 ? ('error' as const) : score <= 90 ? ('warning' as const) : ('success' as const)) : ('info' as const)
