import { shouldForwardProp, shouldForwardPropWithBlackList, shouldForwardPropWithWhiteList } from './shouldForwardProp'

describe('shouldForwardProp', () => {
  test('shouldForwardProp should return correct boolean for valid and invalid prop', () => {
    const validProp = 'value'
    const invalidProp = 'something'
    const valid = shouldForwardProp(validProp)
    const invalid = shouldForwardProp(invalidProp)
    expect(valid).toBe(true)
    expect(invalid).toBe(false)
  })

  test('shouldForwardPropWithBlackList should return correct boolean for valid and invalid prop based on given blacklist', () => {
    const invalidBlacklistedProp = 'isDesktop'
    const validProp = 'onChange'
    const invalidProp = 'something'
    const shouldForwardPropWithBlackListFn = shouldForwardPropWithBlackList([invalidBlacklistedProp])
    const valid1 = shouldForwardPropWithBlackListFn(validProp)
    const valid2 = shouldForwardPropWithBlackListFn(invalidProp)
    const invalid = shouldForwardPropWithBlackListFn(invalidBlacklistedProp)
    expect(valid1).toBe(true)
    expect(valid2).toBe(true)
    expect(invalid).toBe(false)
  })

  test('shouldForwardPropWithWhiteList should return correct boolean for valid and invalid prop based on given whitelist', () => {
    const invalidWhitelistedProp = 'something'
    const validProp = 'value'
    const invalidProp = 'somethingElse'
    const shouldForwardPropWithWhiteListFn = shouldForwardPropWithWhiteList([invalidWhitelistedProp])
    const valid1 = shouldForwardPropWithWhiteListFn(invalidWhitelistedProp)
    const valid2 = shouldForwardPropWithWhiteListFn(validProp)
    const invalid = shouldForwardPropWithWhiteListFn(invalidProp)
    expect(valid1).toBe(true)
    expect(valid2).toBe(true)
    expect(invalid).toBe(false)
  })
})
