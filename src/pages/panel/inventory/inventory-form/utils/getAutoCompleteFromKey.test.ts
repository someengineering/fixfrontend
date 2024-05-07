import {
  AutoCompletePreDefinedItems,
  getAutoCompletePropsFromKey,
  getAutocompleteDataFromKey,
  getAutocompleteValueFromKey,
} from './getAutoCompleteFromKey'

describe('getAutoCompleteFromKey', () => {
  const validKeys = [
    '/ancestors.cloud.reported.name',
    '/ancestors.account.reported.name',
    '/ancestors.region.reported.name',
    '/security.severity',
  ] as const

  const items: AutoCompletePreDefinedItems = {
    accounts: [{ label: 'accounts', value: 'accounts' }],
    clouds: [
      { label: 'clouds', value: 'clouds' },
      { label: 'clouds2', value: 'clouds2' },
    ],
    kinds: [],
    regions: [{ label: 'regions', value: 'regions' }],
    severities: [{ label: 'severities', value: 'severities' }],
  }

  test('getAutocompleteValueFromKey should get autocomplete values from key with give items and no values', () => {
    const cloudsResult = getAutocompleteValueFromKey(validKeys[0], items, null)
    const accountsResult = getAutocompleteValueFromKey(validKeys[1], items, '')
    const invalid = getAutocompleteValueFromKey('invalid', items, null)
    expect(cloudsResult).toBe(null)
    expect(accountsResult).toBe(null)
    expect(invalid).toBe(null)
  })

  test('getAutocompleteValueFromKey should get autocomplete values from key with give items and no values and as array', () => {
    const cloudsResult = getAutocompleteValueFromKey(validKeys[0], items, null)
    const accountsResult = getAutocompleteValueFromKey(validKeys[1], items, '')
    const invalid = getAutocompleteValueFromKey('invalid', items, null)
    expect(cloudsResult).toBe(null)
    expect(accountsResult).toBe(null)
    expect(invalid).toBe(null)
  })

  test('getAutocompleteValueFromKey should get autocomplete values from key with give items and values', () => {
    const cloudsResult = getAutocompleteValueFromKey(validKeys[0], items, 'clouds')
    const accountsResult = getAutocompleteValueFromKey(validKeys[1], items, 'something else')
    const invalid = getAutocompleteValueFromKey('invalid', items, 'invalid')
    expect(cloudsResult!.value).toBe('clouds')
    expect(accountsResult).toBe(null)
    expect(invalid).toBe(null)
  })

  test('getAutocompleteValueFromKey should get autocomplete values from key with give items and values and as array', () => {
    const cloudsResult = getAutocompleteValueFromKey(validKeys[0], items, ['clouds', 'clouds2'])
    const cloudsEmptyResult = getAutocompleteValueFromKey(validKeys[0], items, [])
    const accountsResult = getAutocompleteValueFromKey(validKeys[1], items, ['accounts'])
    const invalid = getAutocompleteValueFromKey('invalid', items, [], true)
    expect(cloudsResult.length).toBe(2)
    expect(cloudsResult[0].value).toBe('clouds')
    expect(cloudsResult[1].value).toBe('clouds2')
    expect(cloudsEmptyResult.length).toBe(0)
    expect(accountsResult.length).toBe(1)
    expect(accountsResult[0].value).toBe('accounts')
    expect(invalid.length).toBe(0)
  })

  test('getAutocompleteValueFromKey should get autocomplete values with new value from give items and values', () => {
    const cloudsResult = getAutocompleteValueFromKey(validKeys[0], items, 'clouds', true)
    const accountsResult = getAutocompleteValueFromKey(validKeys[1], items, 'something else', true)
    const invalid = getAutocompleteValueFromKey('invalid', items, 'invalid', true)
    expect(cloudsResult.value).toBe('clouds')
    expect(accountsResult.value).toBe('something else')
    expect(invalid.value).toBe('invalid')
  })

  test('getAutocompleteValueFromKey should get autocomplete values with new value from give items and values as array', () => {
    const cloudsResult = getAutocompleteValueFromKey(validKeys[0], items, ['clouds', 'clouds2', 'clouds3'], true)
    const cloudsResult2 = getAutocompleteValueFromKey(validKeys[0], items, ['clouds3'], true)
    const cloudsEmptyResult = getAutocompleteValueFromKey(validKeys[0], items, [], true)
    const accountsResult = getAutocompleteValueFromKey(validKeys[1], items, ['accounts', 'accounts2'], true)
    const invalid = getAutocompleteValueFromKey('invalid', items, ['invalid'], true)
    expect(cloudsResult.length).toBe(3)
    expect(cloudsResult[0].value).toBe('clouds')
    expect(cloudsResult[1].value).toBe('clouds2')
    expect(cloudsResult[2].value).toBe('clouds3')
    expect(cloudsResult2.length).toBe(1)
    expect(cloudsResult2[0].value).toBe('clouds3')
    expect(cloudsEmptyResult.length).toBe(0)
    expect(accountsResult.length).toBe(2)
    expect(accountsResult[0].value).toBe('accounts')
    expect(accountsResult[1].value).toBe('accounts2')
    expect(invalid.length).toBe(1)
    expect(invalid[0].value).toBe('invalid')
  })

  test('getAutocompleteValueFromKey should get autocomplete values from key with give items and no values', () => {
    const cloudsResult = getAutocompleteValueFromKey(validKeys[0], items, null)
    const accountsResult = getAutocompleteValueFromKey(validKeys[1], items, '')
    const invalid = getAutocompleteValueFromKey('invalid', items, null)
    expect(cloudsResult).toBe(null)
    expect(accountsResult).toBe(null)
    expect(invalid).toBe(null)
  })

  test('getAutocompleteDataFromKey should get autocomplete data from key with given items', () => {
    const [clouds, accounts, regions, severities] = validKeys.map((key) => getAutocompleteDataFromKey(key, items))
    const invalid = getAutocompleteDataFromKey('invalid', items)
    expect(accounts).toBe(items.accounts)
    expect(clouds).toBe(items.clouds)
    expect(regions).toBe(items.regions)
    expect(severities).toBe(items.severities)
    expect(invalid.length).toBe(0)
  })

  test('getAutoCompletePropsFromKey should get autocomplete props from key', () => {
    const validResults = validKeys.map((key) => getAutoCompletePropsFromKey(key))
    const invalidResult = getAutoCompletePropsFromKey('invalid')
    expect(invalidResult.renderInput).toBeTruthy()
    for (const result of validResults) {
      expect(result.renderInput).toBeTruthy()
    }
  })
})
