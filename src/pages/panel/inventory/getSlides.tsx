import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { env } from 'src/shared/constants'
import { LegendView } from 'src/shared/legend-view'
import { ExternalLink } from 'src/shared/link-button'

const awsDocUrl = `${env.docsUrl}/resources/aws`
const gcpDocUrl = `${env.docsUrl}/resources/google-cloud`
const azureDocUrl = `${env.docsUrl}/resources/azure`

export const getSlides = [
  {
    header: <Trans>Inventory</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The Inventory in Fix provides visibility into all cloud services in use across your infrastructure. Fix scans cloud APIs to get
            a complete snapshot of your cloud infrastructure, which helps achieve two goals:
          </Typography>
          <LegendView>
            <ul>
              <Typography variant="subtitle1" component="li">
                Understand cloud usage
              </Typography>
              <Typography variant="subtitle1" component="li">
                Prevent shadow IT
              </Typography>
            </ul>
          </LegendView>
          <Typography variant="subtitle1">
            Shadow IT is the unauthorized use of cloud services by your developers, bypassing official IT channels and potentially creating
            security, compliance, and management challenges. Full visibility into your inventory makes for better governance over what cloud
            services can and cannot be used, along with enforcement of related security policies.
          </Typography>
          <Typography variant="subtitle1">
            Fix provides coverage of over 300 cloud services across AWS, Microsoft Azure and Google Cloud. For a full list of services,
            please visit our documentation.
          </Typography>
          <ul>
            <Typography variant="subtitle1" component="li">
              AWS: <ExternalLink href={awsDocUrl}>{awsDocUrl}</ExternalLink>
            </Typography>
            <Typography variant="subtitle1" component="li">
              Google Cloud: <ExternalLink href={gcpDocUrl}>{gcpDocUrl}</ExternalLink>
            </Typography>
            <Typography variant="subtitle1" component="li">
              Microsoft Azure: <ExternalLink href={azureDocUrl}>{azureDocUrl}</ExternalLink>
            </Typography>
          </ul>
        </Trans>
      </Stack>
    ),
  },
  {
    header: <Trans>Resource Categories</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            Resource Categories are logical groupings of cloud resources by their principal functionality.
          </Typography>
          <Typography variant="subtitle1">
            Categories make it easy to filter the inventory to get an overview of all resources within a category, irrespective of their
            cloud provider. For example, an Amazon EC2 instance and a Google Cloud Function are both resource kinds within the "Compute"
            category. A resource can only be part of one category, and one category only.
          </Typography>
          <Typography variant="subtitle1">
            Categories are a quicker way to identify the resource kinds in use, and investigate further to detect misconfigurations and
            compliance issues. You can easily see what cloud and account a specific resource is running in.
          </Typography>
        </Trans>
      </Stack>
    ),
  },
  {
    header: <Trans>Resource List</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The resource list is a complete snapshot of the resources in your cloud infrastructure, aggregated by resource kind.
          </Typography>
          <Typography variant="subtitle1">
            A resource "kind" is an individual resource type, for example an Amazon S3 Bucket, or an Azure Virtual Machine. For more context
            on each resource kind, click on the kind in the list and a window with a resource detail view will appear.
          </Typography>
          <Typography variant="subtitle1">
            In addition to individual kinds, Fix also uses abstractions for common cloud services such as storage buckets, databases, or IP
            addresses. These "multi-cloud kinds" are an easy way to search for a specific type of services across clouds.
          </Typography>
          <Typography variant="subtitle1">
            For example, searching for "bucket" in the Explorer tab will surface storage buckets for every cloud: Amazon S3, Google Cloud
            Storage and Azure Blob Storage.
          </Typography>
        </Trans>
      </Stack>
    ),
  },
]
