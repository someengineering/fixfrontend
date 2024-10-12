export function getString<FallbackType = undefined>(str: unknown, fallback?: FallbackType) {
  return typeof str === 'string' && str ? str : (fallback as FallbackType)
}
