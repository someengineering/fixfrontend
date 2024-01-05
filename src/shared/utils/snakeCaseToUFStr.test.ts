import { snakeCaseToUFStr, snakeCaseWordsToUFStr, wordToUFStr } from './snakeCaseToUFStr'

describe('snakeCaseToUFStr', () => {
  test('snakeCaseToUFStr should generate a sentence out of snake-case string', () => {
    const str = 'this-is-a-test'
    const enhancedStr = snakeCaseToUFStr(str)
    expect(enhancedStr).toBe('This is a test')
  })

  test('snakeCaseToUFStr should generate words out of snake-case string', () => {
    const str = 'this-is-a-test'
    const enhancedStr = snakeCaseWordsToUFStr(str)
    expect(enhancedStr).toBe('This Is A Test')
  })

  test('wordToUFStr should generate a word out of snake-case string', () => {
    const str = 'this'
    const enhancedStr = wordToUFStr(str)
    expect(enhancedStr).toBe('This')
  })
})
