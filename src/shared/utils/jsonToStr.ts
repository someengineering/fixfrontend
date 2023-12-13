export const jsonToStr = (param: unknown) => (typeof param === 'string' ? param : JSON.stringify(param)) || ''
