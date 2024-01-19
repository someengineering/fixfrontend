import { adjectives, names, starWars, uniqueNamesGenerator } from 'unique-names-generator'
import { v4 } from 'uuid'

const howManyAddedAccounts = 30
const howManyDiscoveredAccounts = 60
const howManyRecentAccounts = 20

const scannedDateStarted = new Date()
scannedDateStarted.setMinutes(scannedDateStarted.getMinutes() - 10)
const scannedDateFinished = new Date()
const nextScan = new Date()
nextScan.setHours(nextScan.getHours() + 1)

const workspaceCloudAccounts = (howManyAccounts: number, configured: boolean) => {
  const discovered = Math.random() > 0.2
  const degraded = Math.random() > 0.8
  return new Array(howManyAccounts).fill({}).map(() => {
    const name = uniqueNamesGenerator({ dictionaries: [names, adjectives, starWars], separator: '-' })
    return {
      id: v4(),
      cloud: Math.random() > 0.66 ? 'aws' : Math.random() > 0.33 ? 'gcp' : 'fix',
      account_id: Math.round(Math.pow(Math.random(), 5) * 1000000000000)
        .toString()
        .padStart(12, '0'),
      enabled: Math.random() > 0.5,
      is_configured: configured,
      resources: Math.round(Math.random() * 10000),
      next_scan: nextScan,
      user_account_name: name + ' User',
      api_account_alias: name + ' Alias',
      api_account_name: name + ' Name',
      state: degraded ? 'degraded' : configured ? 'configured' : discovered ? 'discovered' : 'detected',
      privileged: Math.random() > 0.8,
      last_scan_started_at: scannedDateStarted,
      last_scan_finished_at: scannedDateFinished,
    }
  })
}

export const workspaceAddedCloudAccounts = workspaceCloudAccounts(howManyAddedAccounts, true)
export const workspaceDiscoveredCloudAccounts = workspaceCloudAccounts(howManyDiscoveredAccounts, false)
export const workspaceRecentCloudAccounts = workspaceCloudAccounts(howManyRecentAccounts, true)

export const allAccounts = () => [workspaceAddedCloudAccounts, workspaceDiscoveredCloudAccounts, workspaceRecentCloudAccounts].flat()
