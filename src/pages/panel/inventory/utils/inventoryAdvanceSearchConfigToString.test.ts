import { inventoryAdvanceSearchConfigToString } from './inventoryAdvanceSearchConfigToString'

test('inventoryAdvanceSearchConfigToString should return query string from config', () => {
  const configWithValue = inventoryAdvanceSearchConfigToString({ id: 0, fqn: 'string', property: 'property', op: '=', value: 'value' })
  const configWithNullStrValue = inventoryAdvanceSearchConfigToString({
    id: 1,
    fqn: 'string',
    property: 'property',
    op: '=',
    value: 'null',
  })
  const configWithNullValue = inventoryAdvanceSearchConfigToString({ id: 2, fqn: 'string', property: 'property', op: '=', value: null })
  const configWithInOpEmptyValue = inventoryAdvanceSearchConfigToString({
    id: 3,
    fqn: 'string',
    property: 'property',
    op: 'in',
    value: '[]',
  })
  const configWithInOpValues = inventoryAdvanceSearchConfigToString({
    id: 4,
    fqn: 'string',
    property: 'property',
    op: 'in',
    value: '[value,value1]',
  })
  const configWithInOpNullStrValue = inventoryAdvanceSearchConfigToString({
    id: 5,
    fqn: 'string',
    property: 'property',
    op: 'in',
    value: 'null',
  })
  const configWithInOpNullValue = inventoryAdvanceSearchConfigToString({
    id: 6,
    fqn: 'string',
    property: 'property',
    op: 'in',
    value: null,
  })
  const configAnyWithValue = inventoryAdvanceSearchConfigToString({ id: 7, fqn: 'any', property: 'property', op: '=', value: 'value' })
  const configAnyWithNullStrValue = inventoryAdvanceSearchConfigToString({
    id: 8,
    fqn: 'any',
    property: 'property',
    op: '=',
    value: 'null',
  })
  const configAnyWithNullValue = inventoryAdvanceSearchConfigToString({ id: 9, fqn: 'any', property: 'property', op: '=', value: null })
  const configAnyWithInOpEmptyValue = inventoryAdvanceSearchConfigToString({
    id: 10,
    fqn: 'any',
    property: 'property',
    op: 'in',
    value: '[]',
  })
  const configAnyWithInOpValues = inventoryAdvanceSearchConfigToString({
    id: 11,
    fqn: 'any',
    property: 'property',
    op: 'in',
    value: '[value,value1]',
  })
  const configAnyWithInOpNullStrValues = inventoryAdvanceSearchConfigToString({
    id: 12,
    fqn: 'any',
    property: 'property',
    op: 'in',
    value: 'null',
  })
  const configAnyWithInOpNullValues = inventoryAdvanceSearchConfigToString({
    id: 13,
    fqn: 'any',
    property: 'property',
    op: 'in',
    value: null,
  })
  expect(configWithValue).toBe('property = "value"')
  expect(configWithNullStrValue).toBe('property = null')
  expect(configWithNullValue).toBe(null)
  expect(configWithInOpEmptyValue).toBe('property in []')
  expect(configWithInOpValues).toBe('property in ["value","value1"]')
  expect(configWithInOpNullStrValue).toBe('property in null')
  expect(configWithInOpNullValue).toBe(null)
  expect(configAnyWithValue).toBe('property = value')
  expect(configAnyWithNullStrValue).toBe('property = null')
  expect(configAnyWithNullValue).toBe(null)
  expect(configAnyWithInOpEmptyValue).toBe('property in []')
  expect(configAnyWithInOpValues).toBe('property in [value,value1]')
  expect(configAnyWithInOpNullStrValues).toBe('property in null')
  expect(configAnyWithInOpNullValues).toBe(null)
})
