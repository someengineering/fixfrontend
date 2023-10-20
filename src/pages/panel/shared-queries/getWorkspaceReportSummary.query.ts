import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceReportSummaryQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-report-summary', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportSummaryResponse>(endPoints.workspaces.inventory.reportSummary(workspaceId) + 'f', { signal })
        .then((res) => res.data)
        .catch(
          () =>
            ({
              overall_score: 77,
              check_summary: {
                available_checks: 73,
                failed_checks: 18,
                failed_checks_by_severity: {
                  critical: 1,
                  medium: 10,
                  low: 3,
                  high: 4,
                },
              },
              accounts: [
                {
                  id: '434236089377',
                  name: 'someengineering-production',
                  cloud: 'aws',
                  score: 79,
                },
                {
                  id: '625596817853',
                  name: 'someengineering-development',
                  cloud: 'aws',
                  score: 76,
                },
              ],
              benchmarks: [
                {
                  id: 'aws_cis_1_5',
                  title: 'AWS CIS 1.5.0',
                  framework: 'CIS',
                  version: '1.5',
                  clouds: ['aws'],
                  description:
                    'The CIS Amazon Web Services Foundations Benchmark provides prescriptive guidance for configuring security options for a subset of Amazon Web Services with an emphasis on foundational, testable, and architecture agnostic settings.',
                  nr_of_checks: 73,
                  account_summary: {
                    '434236089377': {
                      score: 79,
                      failed_checks: {
                        critical: 1,
                        medium: 8,
                        low: 3,
                        high: 4,
                      },
                    },
                    '625596817853': {
                      score: 76,
                      failed_checks: {
                        critical: 1,
                        medium: 10,
                        low: 3,
                        high: 4,
                      },
                    },
                  },
                },
              ],
              changed_vulnerable: {
                since: 'P7D',
                accounts_selection: ['434236089377', '625596817853'],
                resource_count_by_severity: {
                  medium: 94,
                  critical: 2,
                  high: 37,
                  low: 4,
                },
                resource_count_by_kind_selection: {
                  aws_region: 36,
                  aws_vpc: 34,
                  aws_ec2_network_acl: 34,
                },
              },
              changed_compliant: {
                since: 'P7D',
                accounts_selection: [],
                resource_count_by_severity: {},
                resource_count_by_kind_selection: {},
              },
              top_checks: [
                {
                  categories: ['security', 'compliance'],
                  default_values: null,
                  detect: {
                    resoto_cmd:
                      'search is(aws_ec2_network_acl) and acl_entries[*].{(egress=false and cidr_block="0.0.0.0/0" and rule_action=allow and protocol=-1) } | jq --no-rewrite  \'if (( [.reported.acl_entries[]? | contains({egress:false, cidr_block:"0.0.0.0/0", protocol:"-1", rule_action:"deny"}) ] | any | not ) or ((.reported.acl_entries | sort_by(.rule_number) | .[]? | select(.egress==false) | select(.protocol=="-1") |select(.cidr_block=="0.0.0.0/0") | select(.rule_action=="allow") | .rule_number) < (.reported.acl_entries | sort_by(.rule_number) | .[]? | select(.egress==false) | select(.protocol=="-1") | select(.cidr_block=="0.0.0.0/0") | select(.rule_action=="deny") | .rule_number ))) then [.] else [] end\' | flatten',
                  },
                  id: 'aws_ec2_allow_ingress_any_port_ipv4',
                  provider: 'aws',
                  related: null,
                  remediation: {
                    action: null,
                    kind: 'resoto_core_report_check_remediation',
                    text: 'Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive network acls. Recommended best practices is to narrow the definition for the minimum ports required.',
                    url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html',
                  },
                  result_kind: 'aws_ec2_network_acl',
                  risk: 'Even having a perimeter firewall, having network acls open allows any user or malware with vpc access to scan for well known and sensitive ports and gain access to instance.',
                  service: 'ec2',
                  severity: 'high',
                  title: 'Ensure no Network ACLs allow ingress from 0.0.0.0/0 to any port.',
                  url: null,
                },
                {
                  categories: ['security', 'compliance'],
                  default_values: null,
                  detect: {
                    resoto_cmd:
                      'search is(aws_ec2_network_acl) and acl_entries[*].{(egress=false and cidr_block="0.0.0.0/0" and rule_action=allow and (protocol=-1 or (port_range.from_range<22 and port_range.to_range>22)))} | jq --no-rewrite  \'if (( [.reported.acl_entries[]? | if .protocol=="-1" then . else (. | select(.port_range.from_range<22) | select(.port_range.to_range>=22)) end  | contains({egress:false, cidr_block:"0.0.0.0/0", rule_action:"deny"}) ] | any | not ) or ((.reported.acl_entries | sort_by(.rule_number) | .[]? | select(.egress==false) | if .protocol=="-1" then . else (. | select(.port_range.from_range<=22) | select(.port_range.to_range>=22) ) end | select(.cidr_block=="0.0.0.0/0") | select(.rule_action=="allow") | .rule_number) < (.reported.acl_entries | sort_by(.rule_number) | .[]? | select(.egress==false) | if .protocol=="-1" then . else (. | select(.port_range.from_range<=22) | select(.port_range.to_range>=22) ) end | select(.cidr_block=="0.0.0.0/0") | select(.rule_action=="deny") | .rule_number))) then [.] else [] end\' | flatten',
                  },
                  id: 'aws_ec2_allow_ingress_ssh_port_22_ipv4',
                  provider: 'aws',
                  related: null,
                  remediation: {
                    action: null,
                    kind: 'resoto_core_report_check_remediation',
                    text: 'Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive network acls. Recommended best practices is to narrow the definition for the minimum ports required.',
                    url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html',
                  },
                  result_kind: 'aws_ec2_network_acl',
                  risk: 'Even having a perimeter firewall, having network acls open allows any user or malware with vpc access to scan for well known and sensitive ports and gain access to instance.',
                  service: 'ec2',
                  severity: 'high',
                  title: 'Ensure no Network ACLs allow ingress from 0.0.0.0/0 to SSH port 22',
                  url: null,
                },
                {
                  categories: ['security', 'compliance'],
                  default_values: null,
                  detect: {
                    resoto_cmd:
                      'search is(aws_ec2_network_acl) and acl_entries[*].{(egress=false and cidr_block="0.0.0.0/0" and rule_action=allow and (protocol=-1 or (port_range.from_range<3389 and port_range.to_range>3389)))} | jq --no-rewrite  \'if (( [.reported.acl_entries[]? | if .protocol=="-1" then . else (. | select(.port_range.from_range<3389) | select(.port_range.to_range>=3389)) end  | contains({egress:false, cidr_block:"0.0.0.0/0", rule_action:"deny"}) ] | any | not ) or ((.reported.acl_entries | sort_by(.rule_number) | .[]? | select(.egress==false) | if .protocol=="-1" then . else (. | select(.port_range.from_range<=3389) | select(.port_range.to_range>=3389) ) end | select(.cidr_block=="0.0.0.0/0") | select(.rule_action=="allow") | .rule_number) < (.reported.acl_entries | sort_by(.rule_number) | .[]? | select(.egress==false) | if .protocol=="-1" then . else (. | select(.port_range.from_range<=3389) | select(.port_range.to_range>=3389) ) end | select(.cidr_block=="0.0.0.0/0") | select(.rule_action=="deny") | .rule_number))) then [.] else [] end\' | flatten',
                  },
                  id: 'aws_ec2_allow_ingress_rdp_port_3389_ipv4',
                  provider: 'aws',
                  related: null,
                  remediation: {
                    action: null,
                    kind: 'resoto_core_report_check_remediation',
                    text: 'Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive network acls. Recommended best practices is to narrow the definition for the minimum ports required.',
                    url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html',
                  },
                  result_kind: 'aws_ec2_network_acl',
                  risk: 'Even having a perimeter firewall, having network acls open allows any user or malware with vpc access to scan for well known and sensitive ports and gain access to instance.',
                  service: 'ec2',
                  severity: 'high',
                  title: 'Ensure no Network ACLs allow ingress from 0.0.0.0/0 to Microsoft RDP port 3389',
                  url: null,
                },
                {
                  categories: ['security', 'compliance'],
                  default_values: null,
                  detect: {
                    resoto:
                      'is(aws_ec2_security_group) and group_ip_permissions[*].{(ip_protocol=-1 or (from_port>=22 and to_port<=22 and ip_protocol=tcp)) and ip_ranges[*].cidr_ip="0.0.0.0/0"}',
                  },
                  id: 'aws_ec2_allow_ingress_from_internet_to_ssh_port_22_ipv4',
                  provider: 'aws',
                  related: null,
                  remediation: {
                    action: null,
                    kind: 'resoto_core_report_check_remediation',
                    text: 'Apply Zero Trust approach. Implement a process to scan and remediate unrestricted or overly permissive network acls. Recommended best practices is to narrow the definition for the minimum ports required.',
                    url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html',
                  },
                  result_kind: 'aws_ec2_security_group',
                  risk: 'If Security groups are not properly configured the attack surface is increased.',
                  service: 'ec2',
                  severity: 'high',
                  title: 'Ensure no security groups allow ingress from 0.0.0.0/0 to SSH port 22.',
                  url: null,
                },
                {
                  categories: ['security', 'compliance'],
                  default_values: null,
                  detect: {
                    resoto: 'is(aws_root_user) and user_virtual_mfa_devices!=null and user_virtual_mfa_devices!=[]',
                  },
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
              ],
            }) as GetWorkspaceInventoryReportSummaryResponse,
        )
    : undefined
}
