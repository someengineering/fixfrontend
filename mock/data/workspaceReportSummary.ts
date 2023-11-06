import { adjectives, uniqueNamesGenerator } from 'unique-names-generator'
import { workspaceCloudAccounts } from './workspaceCloudAccounts'

const howManyBench = 1

const available_checks = howManyBench ? Math.round(Math.pow(Math.random(), 3) * 1000) : 0

const generateAccountSummary = () =>
  workspaceCloudAccounts.reduce(
    (prev, cur) => {
      const failed_checks = {
        critical: Math.round((Math.random() * cur.resources) / 24),
        high: Math.round((Math.random() * cur.resources) / 24),
        medium: Math.round((Math.random() * cur.resources) / 24),
        low: Math.round((Math.random() * cur.resources) / 24),
      }

      const score = Math.round(
        ((cur.resources - (failed_checks.critical * 4 + failed_checks.high * 3 + failed_checks.medium * 2 + failed_checks.low)) /
          cur.resources) *
          100,
      )

      prev.account_summary[cur.id] = {
        score,
        failed_checks,
      }

      const account = {
        cloud: cur.cloud,
        id: cur.id,
        name: cur.name,
        score,
      }

      prev.accounts.push(account)

      if (prev.worstAccountRaw.length < 3) {
        prev.worstAccountRaw.push(account)
      } else if (prev.bestAccountRaw.length < 3) {
        prev.bestAccountRaw.push(account)
      } else {
        const foundWorst = prev.worstAccountRaw.findIndex((i) => i.score > score)
        if (foundWorst > -1) {
          prev.worstAccountRaw.splice(foundWorst, 1)
          prev.worstAccountRaw.push(account)
        } else {
          const foundBest = prev.bestAccountRaw.findIndex((i) => i.score < score)
          if (foundBest > -1) {
            prev.bestAccountRaw.splice(foundBest, 1)
            prev.bestAccountRaw.push(account)
          }
        }
      }

      return prev
    },
    {
      account_summary: {},
      accounts: [],
      worstAccountRaw: [],
      bestAccountRaw: [],
    } as {
      account_summary: {
        [key: string]: {
          score: number
          failed_checks: {
            critical: number
            high: number
            medium: number
            low: number
          }
        }
      }
      accounts: {
        id: string
        name: string
        cloud: string
        score: number
      }[]
      worstAccountRaw: {
        id: string
        name: string
        cloud: string
        score: number
      }[]
      bestAccountRaw: {
        id: string
        name: string
        cloud: string
        score: number
      }[]
    },
  )

const summaries = new Array(howManyBench).fill({}).map(generateAccountSummary)
const { account_summary, accounts, bestAccountRaw, worstAccountRaw } = summaries[0] ?? {
  account_summary: {},
  accounts: [],
  worstAccountRaw: [],
  bestAccountRaw: [],
}

const worstAccount = worstAccountRaw.sort((a, b) => a.score - b.score)

const bestAccount = bestAccountRaw.sort((a, b) => b.score - a.score)

const failed_checks_by_severity = Object.values(account_summary).reduce(
  (prev, cur) => ({
    critical: prev.critical + cur.failed_checks.critical,
    high: prev.high + cur.failed_checks.high,
    medium: prev.medium + cur.failed_checks.medium,
    low: prev.low + cur.failed_checks.low,
  }),
  {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  },
)

export const workspaceReportSummary = {
  overall_score: accounts.length ? Math.round(accounts.reduce((prev, cur) => prev + cur.score, 0) / accounts.length) : 0,
  check_summary: {
    available_checks,
    failed_checks: available_checks ? available_checks - Math.round(1000 - Math.pow(Math.random(), 6) * 1000) : 0,
    failed_checks_by_severity,
  },
  accounts,
  benchmarks: summaries.map(() => {
    const cloud = Math.random() > 0.5 ? 'aws' : 'gcp'
    const version = Math.round(Math.random() * 300) / 100
    const name = uniqueNamesGenerator({ dictionaries: [adjectives] })
    return {
      id: `${cloud}-${name}-${version.toString().replace('.', '_')}`,
      title: `${cloud.toUpperCase()} ${name.toUpperCase()} ${version}`,
      framework: name.toUpperCase(),
      version: version.toString(),
      clouds: [cloud],
      description:
        'The CIS Amazon Web Services Foundations Benchmark provides prescriptive guidance for configuring security options for a subset of Amazon Web Services with an emphasis on foundational, testable, and architecture agnostic settings.',
      nr_of_checks: available_checks,
      account_summary,
    }
  }),
  changed_vulnerable: {
    since: 'P7D',
    accounts_selection: worstAccount.map((i) => i.id),
    resource_count_by_severity: howManyBench
      ? {
          high: Math.round(Math.random() * 1000),
          medium: Math.round(Math.random() * 1000),
          low: Math.round(Math.random() * 1000),
          critical: Math.round(Math.random() * 1000),
        }
      : {},
    resource_count_by_kind_selection: howManyBench ? { aws_ec2_security_group: 3463, aws_ec2_network_acl: 2682, aws_vpc: 2681 } : {},
  },
  changed_compliant: {
    since: 'P7D',
    accounts_selection: bestAccount.map((i) => i.id),
    resource_count_by_severity: howManyBench
      ? {
          high: Math.round(Math.random() * 1000),
          medium: Math.round(Math.random() * 1000),
          low: Math.round(Math.random() * 1000),
          critical: Math.round(Math.random() * 1000),
        }
      : {},
    resource_count_by_kind_selection: howManyBench ? { aws_ec2_security_group: 3463, aws_ec2_network_acl: 2682, aws_vpc: 2681 } : {},
  },
  top_checks: howManyBench
    ? [
        {
          categories: ['security', 'compliance'],
          default_values: null,
          detect: { resoto: 'is(aws_rds_instance) and db_publicly_accessible==true' },
          id: 'aws_rds_no_public_access',
          provider: 'aws',
          related: null,
          remediation: {
            action: null,
            kind: 'resoto_core_report_check_remediation',
            text: 'Do not allow public access.',
            url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_RDS_Configuring.html',
          },
          result_kind: 'aws_rds_instance',
          risk: 'Publicly accessible databases could expose sensitive data to bad actors.',
          service: 'rds',
          severity: 'critical',
          title: 'Ensure there are no Public Accessible RDS instances.',
          url: null,
        },
        {
          categories: ['security', 'compliance'],
          default_values: null,
          detect: { resoto: 'is(aws_root_user) and mfa_active!=true' },
          id: 'aws_iam_root_mfa_enabled',
          provider: 'aws',
          related: null,
          remediation: {
            action: null,
            kind: 'resoto_core_report_check_remediation',
            text: 'Using IAM console navigate to Dashboard and expand Activate MFA on your root account.',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#id_root-user_manage_mfa',
          },
          result_kind: 'aws_root_user',
          risk: 'The root account is the most privileged user in an AWS account. MFA adds an extra layer of protection on top of a user name and password. With MFA enabled when a user signs in to an AWS website they will be prompted for their user name and password as well as for an authentication code from their AWS MFA device. When virtual MFA is used for root accounts it is recommended that the device used is NOT a personal device but rather a dedicated mobile device (tablet or phone) that is managed to be kept charged and secured independent of any individual personal devices. (non-personal virtual MFA) This lessens the risks of losing access to the MFA due to device loss / trade-in or if the individual owning the device is no longer employed at the company.',
          service: 'iam',
          severity: 'critical',
          title: 'Ensure MFA is enabled for the root account',
          url: null,
        },
        {
          categories: ['security', 'compliance'],
          default_values: null,
          detect: { resoto: 'is(aws_root_user) and user_virtual_mfa_devices!=null and user_virtual_mfa_devices!=[]' },
          id: 'aws_iam_root_hardware_mfa_enabled',
          provider: 'aws',
          related: null,
          remediation: {
            action: null,
            kind: 'resoto_core_report_check_remediation',
            text: 'Using IAM console navigate to Dashboard and expand Activate MFA on your root account.',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#id_root-user_manage_mfa',
          },
          result_kind: 'aws_root_user',
          risk: 'The root account is the most privileged user in an AWS account. MFA adds an extra layer of protection on top of a user name and password. With MFA enabled when a user signs in to an AWS website they will be prompted for their user name and password as well as for an authentication code from their AWS MFA device. For Level 2 it is recommended that the root account be protected with a hardware MFA./ trade-in or if the individual owning the device is no longer employed at the company.',
          service: 'iam',
          severity: 'critical',
          title: 'Ensure hardware MFA is enabled for the root account',
          url: null,
        },
        {
          categories: ['security', 'compliance'],
          default_values: { certificate_expiration: '0d' },
          detect: { resoto: 'is(aws_iam_server_certificate) and expires<{{certificate_expiration.from_now}}' },
          id: 'aws_iam_expired_server_certificates',
          provider: 'aws',
          related: null,
          remediation: {
            action: {
              cli: 'search is(aws_iam_server_certificate) and expires<@UTC@ | clean',
              aws_cli: 'aws iam delete-server-certificate --server-certificate-name {{name}}',
            },
            kind: 'resoto_core_report_check_remediation',
            text: 'Deleting the certificate could have implications for your application if you are using an expired server certificate with Elastic Load Balancing, CloudFront, etc. One has to make configurations at respective services to ensure there is no interruption in application functionality.',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html',
          },
          result_kind: 'aws_iam_server_certificate',
          risk: 'Removing expired SSL/TLS certificates eliminates the risk that an invalid certificate will be deployed accidentally to a resource such as AWS Elastic Load Balancer (ELB), which can damage the credibility of the application/website behind the ELB.',
          service: 'iam',
          severity: 'critical',
          title: 'Ensure that all the expired SSL/TLS certificates stored in AWS IAM are removed.',
          url: null,
        },
        {
          categories: ['security', 'compliance'],
          default_values: null,
          detect: {
            resoto:
              'is(aws_cloud_trail) and trail_status.is_logging==true --> is(aws_s3_bucket) and bucket_public_access_block_configuration.{block_public_acls!=true or ignore_public_acls!=true or block_public_policy!=true or restrict_public_buckets!=true} or bucket_acl.grants[*].{permission in [READ, READ_ACP] and grantee.uri=="http://acs.amazonaws.com/groups/global/AllUsers"}}',
          },
          id: 'aws_cloudtrail_logs_s3_bucket_is_not_publicly_accessible',
          provider: 'aws',
          related: null,
          remediation: {
            action: null,
            kind: 'resoto_core_report_check_remediation',
            text: 'Analyze Bucket policy to validate appropriate permissions. Ensure the AllUsers principal is not granted privileges. Ensure the AuthenticatedUsers principal is not granted privileges.',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html',
          },
          result_kind: 'aws_cloud_trail',
          risk: 'Allowing public access to CloudTrail log content may aid an adversary in identifying weaknesses in the affected accounts use or configuration.',
          service: 'cloudtrail',
          severity: 'critical',
          title: 'Ensure the S3 bucket CloudTrail logs is not publicly accessible',
          url: null,
        },
      ]
    : [],
}
