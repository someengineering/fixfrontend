import { getPermissions, maxPermissionNumber } from './getPermissions'

describe('getPermissions', () => {
  it('should return an empty array for zero', () => {
    expect(getPermissions(0)).toEqual([])
  })

  it('should return correct permissions for a single flag', () => {
    expect(getPermissions(1)).toEqual(['create']) // 1 << 0
    expect(getPermissions(2)).toEqual(['read']) // 1 << 1
    expect(getPermissions(8)).toEqual(['delete']) // 1 << 3
  })

  it('should return multiple permissions for combined flags', () => {
    const combined = 13 // 1 << 0 | 1 << 2 | 1 << 3
    expect(getPermissions(combined)).toEqual(['create', 'update', 'delete'])
  })

  it('should handle all flags combined', () => {
    expect(getPermissions(maxPermissionNumber).length).toBe(13)
    expect(getPermissions(maxPermissionNumber)).toContain('create')
    expect(getPermissions(maxPermissionNumber)).toContain('updateRoles')
  })
})
