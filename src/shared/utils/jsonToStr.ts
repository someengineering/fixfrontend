export const jsonToStr = (param: unknown) =>
  (typeof param === 'string' || param === null || param === undefined ? param : JSON.stringify(param)) || ''
