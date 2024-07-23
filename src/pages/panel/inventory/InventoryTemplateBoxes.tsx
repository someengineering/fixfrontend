import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import DynamicFormIcon from '@mui/icons-material/DynamicForm'
import HistoryIcon from '@mui/icons-material/History'
import SecurityIcon from '@mui/icons-material/Security'
import { Box, Card, CardContent, CardHeader, Divider, Grid, Link, Stack, Typography } from '@mui/material'
import { FC, Fragment } from 'react'
import { WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'

interface InventoryTemplateBoxesProps {
  onChange: (value?: string, history?: { changes: WorkspaceInventorySearchTableHistoryChanges[]; after?: string; before?: string }) => void
  withHistory?: boolean
}

interface TemplateData {
  header: string
  icon: FC
  content: {
    title: string
    description: string
    search: string
    history?: {
      changes: WorkspaceInventorySearchTableHistoryChanges[]
      after?: string
      before?: string
    }
  }[]
}

const templateData = (): TemplateData[] => [
  {
    header: t`Security`,
    icon: SecurityIcon,
    content: [
      {
        title: t`Public S3 Buckets`,
        description: t`Identifies S3 buckets that are publicly accessible.`,
        search:
          'is(aws_s3_bucket) {account_setting: <-[0:]- is(aws_account) --> is(aws_s3_account_settings)} ((account_setting.reported.bucket_public_access_block_configuration.{block_public_acls != true or ignore_public_acls != true or block_public_policy != true or restrict_public_buckets != true} and bucket_public_access_block_configuration.{block_public_acls != true or ignore_public_acls != true or block_public_policy != true or restrict_public_buckets != true}) and ((bucket_acl.grants[*].{permission in [READ, READ_ACP, WRITE, WRITE_ACP, FULL_CONTROL] and grantee.uri = "http://acs.amazonaws.com/groups/global/AllUsers"}) or (bucket_policy.Statement[*].{Effect = Allow and (Principal = "*" or Principal.AWS = "*" or Principal.CanonicalUser = "*") and (Action in ["s3:GetObject", "s3:PutObject", "s3:Get*", "s3:Put*", "s3:*", "*"] or Action[*] in ["s3:GetObject", "s3:PutObject", "s3:Get*", "s3:Put*", "s3:*", "*"])})))',
      },
      {
        title: t`Unencrypted EBS Volumes`,
        description: t`Identifies EBS volumes that are not encrypted.`,
        search: 'is(aws_ec2_volume) and volume_encrypted = false',
      },
      {
        title: t`Unencrypted Database Storage`,
        description: t`Finds databases that aren't encrypted at rest.`,
        search: 'is(aws_rds_instance) and volume_encrypted = false',
      },
      {
        title: t`Open Database Access`,
        description: t`Identifies databases publicly accessible from any IP on the Internet.`,
        search: 'is(aws_rds_instance) and db_publicly_accessible = true',
      },
      {
        title: t`Public RDS Snapshots`,
        description: t`Identifies RDS snapshots that are publicly accessible.`,
        search: 'is(aws_rds_cluster_snapshot, aws_rds_snapshot) and rds_attributes.restore[*] = all',
      },
    ],
  },
  {
    header: t`Abandoned`,
    icon: BrokenImageIcon,
    content: [
      {
        title: t`Load Balancers with no backends`,
        description: t`Finds load balancers that are not associated with any running instances.`,
        search: 'is(load_balancer) and backends = []',
      },
      {
        title: t`Orphaned Volumes`,
        description: t`Identifies storage volumes that are not attached to any running instance and had no read operations in the last 7 days.`,
        search: 'is(aws_ec2_volume) and volume_status = available and last_access > 7d',
      },
      {
        title: t`Orphaned Snapshots`,
        description: t`Finds snapshots of disks that are no longer in use, which potentially could be deleted to reduce storage costs.`,
        search:
          'is(aws_ec2_snapshot,aws_rds_snapshot,aws_rds_cluster_snapshot) with(empty, <-- is(aws_ec2_volume,aws_rds_instance,aws_rds_cluster))',
      },
      {
        title: t`Orphaned CloudWatch Instance Alarms`,
        description: t`Finds CloudWatch instance alarms where the instance no longer exists.`,
        search: 'is(aws_cloudwatch_alarm) and cloudwatch_dimensions[*].name = InstanceId with (empty, <-- is(aws_ec2_instance))',
      },
      {
        title: t`Unattached Elastic IPs`,
        description: t`Identifies Elastic IP addresses that are allocated but not associated with any network interface.`,
        search: 'is(aws_ec2_elastic_ip) with(empty, <-- is(aws_ec2_network_interface))',
      },
      {
        title: t`Resources with the string "delete"`,
        description: t`Engineers like to tag their temporary resources with the string "delete". This performs a full-text search in names, tags and other string properties.`,
        search: '"delete"',
      },
    ],
  },
  {
    header: t`Underutilized`,
    icon: DynamicFormIcon,
    content: [
      {
        title: t`Low Utilization Compute Instances and Databases`,
        description: t`Identifies compute instances and databases with low CPU usage, indicating potential over-provisioning.`,
        search: 'with_usage(7d, cpu_utilization_percent) is(instance,database) and /usage.cpu_utilization_percent.max < 10',
      },
      {
        title: t`Unused Database Instances`,
        description: t`Searches for database instances with no connections over a significant period, indicating potential waste.`,
        search: 'is(aws_rds_instance) and last_access > 30d',
      },
    ],
  },
]

const templateHistoryData = (): TemplateData[] => {
  const aDay = 24 * 60 * 60 * 1000
  const aWeek = 7 * aDay
  const aMonth = 30 * aDay
  const thirtyOneDays = 30 * aDay
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate.getTime() - aWeek)
  const twentyFourHoursAgo = new Date(currentDate.getTime() - aDay)
  const thirtyDaysAgo = new Date(currentDate.getTime() - aMonth)
  const thirtyOneDaysAgo = new Date(currentDate.getTime() - thirtyOneDays)
  return [
    {
      header: t`Resource Changes`,
      icon: HistoryIcon,
      content: [
        {
          title: t`All Changes`,
          description: t`All changes over all resources.`,
          search: 'all',
          history: {
            changes: ['node_compliant', 'node_vulnerable', 'node_created', 'node_updated', 'node_deleted'],
          },
        },
        {
          title: t`Created in the last 7 days`,
          description: t`Resources Created in the last 7 days.`,
          search: 'all',
          history: {
            changes: ['node_created'],
            after: sevenDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Updated in the last 7 days`,
          description: t`Resources Updated in the last 7 days.`,
          search: 'all',
          history: {
            changes: ['node_updated'],
            after: sevenDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Deleted in the last 7 days`,
          description: t`Resources Deleted in the last 7 days.`,
          search: 'all',
          history: {
            changes: ['node_deleted'],
            after: sevenDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
      ],
    },
    {
      header: t`Security Changes`,
      icon: SecurityIcon,
      content: [
        {
          title: t`Vulnerable in the last 24 hours`,
          description: t`Vulnerable Resources detected in the last 24 hours.`,
          search: 'all',
          history: {
            changes: ['node_vulnerable'],
            after: twentyFourHoursAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Vulnerable in the last 7 days`,
          description: t`Vulnerable Resources detected in the last 7 days.`,
          search: 'all',
          history: {
            changes: ['node_vulnerable'],
            after: sevenDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Vulnerable in the last 31 days`,
          description: t`Vulnerable Resources detected in the last 31 days.`,
          search: 'all',
          history: {
            changes: ['node_vulnerable'],
            after: thirtyOneDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Compliant in the last 7 days`,
          description: t`Resources became compliant in the last 7 days.`,
          search: 'all',
          history: {
            changes: ['node_compliant'],
            after: sevenDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
      ],
    },
    {
      header: t`Drill Down`,
      icon: DynamicFormIcon,
      content: [
        {
          title: t`Last 7 days change count by kind`,
          description: t`Number of changes in the last 7 days counted by kind.`,
          search: 'aggregate(kind, /change: sum(1) as count): all sort /count desc, /group.kind asc',
          history: {
            changes: ['node_created', 'node_updated', 'node_deleted'],
            after: sevenDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Serverless function changes`,
          description: t`Serverless function changes in the last 30 days.`,
          search: 'is(serverless_function)',
          history: {
            changes: ['node_created', 'node_updated', 'node_deleted'],
            after: thirtyDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`IAM Role changes`,
          description: t`IAM Role changes in the last 30 days.`,
          search: 'is(role)',
          history: {
            changes: ['node_created', 'node_updated', 'node_deleted'],
            after: thirtyDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Compute Changes`,
          description: t`Compute changes in the last 30 days.`,
          search: 'is(instance)',
          history: {
            changes: ['node_created', 'node_updated', 'node_deleted'],
            after: thirtyDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
        {
          title: t`Resource changes with owner tag`,
          description: t`Number of Resources changed, broken down by owner tag in the last 30 days.`,
          search: 'aggregate(tags.owner, /change: sum(1) as count): tags.owner != null sort /count desc, /group.owner asc',
          history: {
            changes: ['node_created', 'node_updated', 'node_deleted'],
            after: thirtyDaysAgo.toISOString(),
            before: currentDate.toISOString(),
          },
        },
      ],
    },
  ]
}

export const InventoryTemplateBoxes = ({ onChange, withHistory }: InventoryTemplateBoxesProps) => {
  useLingui()
  return (
    <>
      <Typography variant="h5" mb={2}>
        <Trans>Example searches</Trans>
      </Typography>
      <Grid container spacing={2}>
        {(withHistory ? templateHistoryData() : templateData()).map((template, i) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
            <Card elevation={4}>
              <CardHeader title={template.header} avatar={<template.icon />} />
              <CardContent>
                {template.content.map((content, i) => (
                  <Fragment key={i}>
                    <Stack spacing={1}>
                      <Link
                        component={Typography}
                        variant="h6"
                        onClick={() => onChange(content.search, content.history)}
                        sx={{ cursor: 'pointer' }}
                      >
                        {content.title}
                      </Link>
                      <Typography>{content.description}</Typography>
                    </Stack>
                    {i === template.content.length - 1 ? null : (
                      <Box my={1}>
                        <Divider />
                      </Box>
                    )}
                  </Fragment>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
