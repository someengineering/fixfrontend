import { Trans, t } from '@lingui/macro'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import DynamicFormIcon from '@mui/icons-material/DynamicForm'
import SecurityIcon from '@mui/icons-material/Security'
import { Box, Card, CardContent, CardHeader, Divider, Grid, Link, Stack, Typography } from '@mui/material'
import { FC, Fragment } from 'react'

interface InventoryTemplateBoxesProps {
  onChange: (value?: string) => void
}

interface TemplateData {
  header: string
  icon: FC
  content: {
    title: string
    description: string
    search: string
  }[]
}

const templateData: TemplateData[] = [
  {
    header: t`Security`,
    icon: SecurityIcon,
    content: [
      {
        title: t`Unencrypted EBS Volumes`,
        description: t`Identifies EBS volumes that are not encrypted.`,
        search: 'is(aws_ec2_volume) and volume_encrypted = false',
      },
      {
        title: t`Public S3 Buckets`,
        description: t`Identifies S3 buckets that are publicly accessible.`,
        search:
          'is(aws_s3_bucket) and (bucket_public_access_block_configuration = null or (bucket_public_access_block_configuration != null and (bucket_public_access_block_configuration.{block_public_acls = false or ignore_public_acls = false or block_public_policy = false or restrict_public_buckets = false})) and (bucket_acl.grants[*].{permission in [READ, READ_ACP] and grantee.uri = "http://acs.amazonaws.com/groups/global/AllUsers"}) or (bucket_policy.Statement[*].{Principal = "*" and (Action in [s3:GetObject, s3:PutObject] or Action[*] in [s3:GetObject, s3:PutObject])}))',
      },
      {
        title: t`Open Database Access`,
        description: t`Identifies databases publicly accessible from any IP on the Internet.`,
        search: 'is(aws_rds_instance) and db_publicly_accessible = true',
      },
      {
        title: t`Unencrypted Database Storage`,
        description: t`Finds databases that aren't encrypted at rest.`,
        search: 'is(aws_rds_instance) and volume_encrypted = false',
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
        title: t`Resources with the string "deleteme"`,
        description: t`Engineers like to tag their temporary resources with appropriately chosen names. This searches for the string "deleteme" in names, tags and other string properties.`,
        search: '"deleteme"',
      },
      {
        title: t`Orphaned Volumes`,
        description: t`Identifies storage volumes that are not attached to any running instance and had no read operations in the last 7 days.`,
        search: 'is(aws_ec2_volume) and volume_status = available and last_access > 7d',
      },
      {
        title: t`Load Balancers with no backends`,
        description: t`Finds load balancers that are not associated with any running instances.`,
        search: 'is(load_balancer) and backends = []',
      },
      {
        title: t`Unattached Elastic IPs`,
        description: t`Identifies Elastic IP addresses that are allocated but not associated with any network interface.`,
        search: 'is(aws_ec2_elastic_ip) with(empty, <-- is(aws_ec2_network_interface))',
      },
      {
        title: t`Orphaned Snapshots`,
        description: t`Finds snapshots of disks that are no longer in use, which potentially could be deleted to reduce storage costs.`,
        search:
          'is(aws_ec2_snapshot,aws_rds_snapshot,aws_rds_cluster_snapshot) with(empty, <-- is(aws_ec2_volume,aws_rds_instance,aws_rds_cluster))',
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

export const InventoryTemplateBoxes = ({ onChange }: InventoryTemplateBoxesProps) => {
  return (
    <>
      <Typography variant="h5" mb={2}>
        <Trans>Example searches</Trans>
      </Typography>
      <Grid container spacing={2}>
        {templateData.map((template, i) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
            <Card elevation={4}>
              <CardHeader title={template.header} avatar={<template.icon />} />
              <CardContent>
                {template.content.map((content, i) => (
                  <Fragment key={i}>
                    <Stack spacing={1}>
                      <Link component={Typography} variant="h6" onClick={() => onChange(content.search)} sx={{ cursor: 'pointer' }}>
                        {content.title}
                      </Link>
                      <Typography>{content.description}</Typography>
                    </Stack>
                    <Box my={1}>
                      <Divider />
                    </Box>
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
