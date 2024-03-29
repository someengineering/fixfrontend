import { getLocationSearchValues, mergeLocationSearchValues, removeLocationSearchValues } from './windowLocationSearch'

describe('windowLocationSearch', () => {
  test('getLocationSearchValues should return json from search', () => {
    const url = 'https://www.example.com?value1=value&value2=val&value3=v'
    const origLocation = window.location
    Object.defineProperty(window, 'location', {
      value: new URL(url),
    })
    const definedSearch = getLocationSearchValues('value1=value&value2=val&value3=v')
    window.location.search = 'value1=value&value2=val&value3=v'
    const search = getLocationSearchValues()
    expect(definedSearch['value1']).toBe('value')
    expect(definedSearch['value2']).toBe('val')
    expect(definedSearch['value3']).toBe('v')
    expect(search['value1']).toBe('value')
    expect(search['value2']).toBe('val')
    expect(search['value3']).toBe('v')
    Object.defineProperty(window, 'location', { value: origLocation })
  })

  test('mergeLocationSearchValues should return merged search', () => {
    const search = mergeLocationSearchValues({ value1: 'value', value2: 'val', value3: 'v' })
    expect(search).toBe('?value1=value&value2=val&value3=v')
  })

  test('removeLocationSearchValues should return merged search with removed key', () => {
    const search1 = removeLocationSearchValues({ value1: 'value', value2: 'val', value3: 'v' }, 'value3')
    const search2 = removeLocationSearchValues({ value1: 'value', value2: 'val', value3: 'v' }, 'value')
    expect(search1).toBe('?value1=value&value2=val')
    expect(search2).toBe('?value1=value&value2=val&value3=v')
  })
})
