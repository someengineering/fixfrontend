export const isTouchEvent = (e: MouseEvent | TouchEvent): e is TouchEvent => {
  return 'changedTouches' in e
}
