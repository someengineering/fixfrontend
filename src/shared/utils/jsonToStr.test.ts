import { jsonToStr } from './jsonToStr'

test('jsonToStr should return string from any values', () => {
  const str = 'string'
  const undef = undefined
  const nul = null
  const num = 0
  const bool = false
  const arrFunc = (_: unknown) => null
  const func = function (_: unknown) {
    return null
  }
  const json = { str, undef, nul, num, bool, arrFunc, func }
  const array = [json]
  const strStr = jsonToStr(str)
  const undefStr = jsonToStr(undef)
  const nulStr = jsonToStr(nul)
  const numStr = jsonToStr(num)
  const boolStr = jsonToStr(bool)
  const arrFuncStr = jsonToStr(arrFunc)
  const funcStr = jsonToStr(func)
  const jsonStr = jsonToStr(json)
  const arrayStr = jsonToStr(array)

  expect(strStr).toBe(strStr)
  expect(undefStr).toBe('')
  expect(nulStr).toBe('')
  expect(numStr).toBe('0')
  expect(boolStr).toBe('false')
  expect(arrFuncStr).toBe('')
  expect(funcStr).toBe('')
  expect(jsonStr).toBe('{"str":"string","nul":null,"num":0,"bool":false}')
  expect(arrayStr).toBe('[{"str":"string","nul":null,"num":0,"bool":false}]')
})
