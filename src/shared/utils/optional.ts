export function combineOptional<T>(left: T | undefined, right: T | undefined, combine: (a: T, b: T) => T): T | undefined {
  if (left !== undefined && right !== undefined) {
    return combine(left, right)
  } else if (left !== undefined) {
    return left
  } else {
    return right
  }
}
