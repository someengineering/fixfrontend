import { AccountCloud } from 'src/shared/types/server-shared'

export const getAccountCloudName = (cloud: AccountCloud) => {
  switch (cloud.toLowerCase()) {
    case 'aws':
      return 'AWS'
    case 'azure':
      return 'Azure'
    case 'fix':
      return 'FIX'
    case 'gcp':
      return 'GCP'
    default:
      return cloud
  }
}
