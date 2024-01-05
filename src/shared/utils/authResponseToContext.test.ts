import { authResponseToContext } from './authResponseToContext'

test('auth context should return default value', () => {
  const authContext = authResponseToContext()
  expect(authContext.isAuthenticated).toBe(true)
  expect(authContext.selectedWorkspace).toBe(undefined)
  expect(authContext.workspaces.length).toBe(0)
})
