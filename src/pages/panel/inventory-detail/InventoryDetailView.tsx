import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { alpha, Box, Divider, IconButton, Modal as MuiModal, Slide, Stack, styled, Tooltip, Typography } from '@mui/material'
import { useQueries } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { Location, useLocation, useParams } from 'react-router-dom'
import { CloseIcon, getNameAndIconFromMetadataGroup } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryModelQuery, postWorkspaceInventoryDescendantSummaryQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { cloudToColor, CloudToIcon } from 'src/shared/cloud-avatar'
import { env } from 'src/shared/constants'
import { ExternalLink, InternalLink, InternalLinkButton } from 'src/shared/link-button'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { GetWorkspaceInventoryModelResponse, PostWorkspaceInventoryDescendantSummaryResponse } from 'src/shared/types/server'
import { AccountCloud, ResourceComplexKind } from 'src/shared/types/server-shared'
import { getString } from 'src/shared/utils/getString'

const Modal = styled(MuiModal)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  left: 'auto',
  height: '100%',
  width: '100%',
  borderTopLeftRadius: '12px',
  borderBottomLeftRadius: '12px',

  [theme.breakpoints.up('md')]: {
    width: '50%',
  },

  [theme.breakpoints.up('xl')]: {
    width: '42%',
    maxWidth: 604,
  },
}))

export default function InventoryDetailView() {
  const { selectedWorkspace } = useUserProfile()
  const {
    i18n: { locale },
  } = useLingui()
  const navigate = useAbsoluteNavigate()
  const { resourceId } = useParams<'resourceId'>()
  const { state } = useLocation() as Location<{
    resource: ResourceComplexKind
    group: string | null
    cloud: AccountCloud
    resources: number
    accounts: number
    regions: number
    base: string | null
  }>
  const {
    accounts = 0,
    base = 'N/A',
    cloud = 'N/A' as AccountCloud,
    name = resourceId ?? 'N/A',
    description,
    url,
    source,
    service,
    allBases = [],
    group = { name: 'N/A', Icon: undefined },
    regions = 0,
    resources = 0,
    isLoading,
  } = useQueries({
    queries: [
      {
        queryKey: [
          'workspace-inventory-model',
          selectedWorkspace?.id,
          undefined,
          'aws_,gcp_,azure_',
          true,
          false,
          true,
          false,
          true,
          true,
          true,
        ],
        queryFn: getWorkspaceInventoryModelQuery,
        select: (data: GetWorkspaceInventoryModelResponse) => {
          const resource = data.find((item) => item.fqn === resourceId)
          if (resource) {
            let base: string | undefined
            let allBases: ResourceComplexKind[] = []
            if ('bases' in resource && resource.bases?.length) {
              allBases = resource.bases
                .map((base) => data.find((dataItem) => dataItem.fqn === base))
                .filter((base) => base && 'metadata' in base && base.metadata?.source === 'base') as ResourceComplexKind[]
              if (allBases.length > 1) {
                const noResourceBase = allBases.filter((i) => i?.fqn !== 'resource')[0]
                base =
                  (noResourceBase &&
                    typeof noResourceBase.metadata?.name === 'string' &&
                    (noResourceBase.metadata.name ?? noResourceBase.fqn)) ||
                  undefined
              } else {
                base =
                  (allBases[0] && typeof allBases[0].metadata?.name === 'string' && (allBases[0].metadata.name ?? allBases[0].fqn)) ||
                  undefined
              }
            }
            const group = 'metadata' in resource ? getString(resource.metadata?.group) : undefined
            const groupNameAndIcon = group ? getNameAndIconFromMetadataGroup(group) : undefined
            const cloud: AccountCloud =
              ('metadata' in resource && getString(resource.metadata?.source)) || resource.fqn.split('_')[0].replace('microsoft', 'azure')
            const name = ('metadata' in resource && getString(resource.metadata?.name)) || undefined
            const description = ('metadata' in resource && getString(resource.metadata?.description)) || undefined
            const url = ('metadata' in resource && getString(resource.metadata?.docs_url)) || undefined
            const source = ('metadata' in resource && getString(resource.metadata?.source)) || undefined
            const service = ('metadata' in resource && getString(resource.metadata?.service)) || undefined

            return { resource, base, group: groupNameAndIcon, cloud, name, description, url, source, service, allBases }
          }
        },
        initialData:
          resourceId && state?.resource
            ? [
                state.resource as ResourceComplexKind,
                ...(state.base && state.resource.bases?.[0]
                  ? [
                      {
                        fqn: state.resource.bases[0],
                        aggregate_root: false,
                        allow_unknown_props: false,
                        runtime_kind: '',
                        type: 'object',
                        metadata: {
                          source: 'base',
                          name: state.base,
                        },
                      } as ResourceComplexKind,
                    ]
                  : []),
              ]
            : undefined,
        enabled: !resourceId || !selectedWorkspace?.id,
      },
      {
        queryKey: ['workspace-inventory-descendant-summary', selectedWorkspace?.id, undefined, undefined, undefined, resourceId],
        queryFn: postWorkspaceInventoryDescendantSummaryQuery,
        enabled: !resourceId || !selectedWorkspace?.id,
        select: (data: PostWorkspaceInventoryDescendantSummaryResponse) => (resourceId ? data[resourceId] : undefined),
        initialData:
          resourceId && state?.accounts !== undefined && state?.regions !== undefined && state?.resources !== undefined
            ? { [resourceId]: { accounts: state.accounts, regions: state.regions, resources: state.resources } }
            : undefined,
      },
    ],
    combine: ([
      { data: { base, cloud, group, resource, name, description, url, source, service, allBases } = {}, isLoading: isLoading1 },
      { data: { accounts, regions, resources } = {}, isLoading: isLoading2 },
    ]) => {
      if (resource) {
        return {
          base,
          cloud,
          group,
          accounts,
          regions,
          resources,
          name,
          description,
          url,
          source,
          service,
          allBases,
          isLoading: isLoading1 || isLoading2,
        }
      }
      return { isLoading: false }
    },
  })

  const handleClose = useCallback(() => {
    navigate({ pathname: '../..', hash: window.location.hash })
  }, [navigate])

  useEffect(() => {
    if (!resourceId) {
      handleClose()
    }
  }, [resourceId, handleClose])

  const cloudColors = cloudToColor(cloud ?? '')

  return (
    <Modal open={!!resourceId} onClose={handleClose} slotProps={{ backdrop: { sx: { bgcolor: alpha('#000', 0.6) } } }}>
      <Slide in={!!resourceId} direction="left" mountOnEnter unmountOnExit>
        <Stack
          position="absolute"
          top={0}
          right={0}
          width="100%"
          height="100%"
          sx={{
            bgcolor: 'common.white',
            boxShadow: 24,
            borderTopLeftRadius: { xs: '0', md: '12px' },
            borderBottomLeftRadius: { xs: '0', md: '12px' },
          }}
          direction="column"
          overflow="auto"
        >
          <Stack direction="row" p={3} position="sticky" top={-8} zIndex="modal" boxShadow={1}>
            <Stack direction="row" alignItems="start" gap={2} flex={1}>
              {isLoading ? (
                '...'
              ) : (
                <>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    flex={0}
                    borderRadius="6px"
                    border={`1px solid ${cloudColors.base}`}
                    bgcolor={cloudColors.light}
                    p={2}
                  >
                    <CloudToIcon cloud={cloud ?? ''} fallback={'N/A'} />
                  </Stack>
                  <Stack spacing={1}>
                    <Typography variant="h4">{name}</Typography>
                    <Stack direction="row" gap={2} alignItems="center">
                      <Typography variant="subtitle1">{base}</Typography>
                      <Divider orientation="vertical" flexItem />
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        {group.Icon ? <group.Icon /> : null}
                        <Typography variant="subtitle1">{group.name}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </>
              )}
            </Stack>
            <Box>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon width={35} height={35} />
              </IconButton>
            </Box>
          </Stack>
          <Divider />
          <Stack p={3} mb={2.75} spacing={3}>
            {isLoading ? (
              <LoadingSuspenseFallback />
            ) : (
              <>
                {description ? (
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      <Trans>Description</Trans>
                    </Typography>
                    <Typography variant="subtitle1">{description}</Typography>
                  </Stack>
                ) : null}
                <Box>
                  <Divider flexItem />
                  <Stack direction="row" gap={1} justifyContent="space-evenly" width="100%" py={2}>
                    <Stack>
                      <Typography variant="h3" textAlign="center">
                        {resources.toLocaleString(locale)}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        <Trans>Resources</Trans>
                      </Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack justifyContent="center" textAlign="center">
                      <Typography variant="h3">{accounts.toLocaleString(locale)}</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        <Trans>Accounts</Trans>
                      </Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack justifyContent="center" textAlign="center">
                      <Typography variant="h3">{regions.toLocaleString(locale)}</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        <Trans>Regions</Trans>
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider flexItem />
                </Box>
                {resourceId ? (
                  <InternalLinkButton variant="contained" fullWidth to={`/inventory/search?q=is(${resourceId})`}>
                    <Trans>View this resource kind in Explorer</Trans>
                  </InternalLinkButton>
                ) : null}
                <Stack spacing={4} direction="row" width="100%">
                  <Stack spacing={1.5}>
                    {url ? (
                      <Typography variant="subtitle1" whiteSpace="nowrap">
                        <Trans>Product Documentation</Trans>
                      </Typography>
                    ) : null}
                    {source && resourceId ? (
                      <Typography variant="subtitle1" whiteSpace="nowrap">
                        <Trans>Fix Data Model: </Trans>
                      </Typography>
                    ) : null}
                    {allBases.length ? (
                      <Typography variant="subtitle1" whiteSpace="nowrap">
                        <Trans>Inheritance:</Trans>
                      </Typography>
                    ) : null}
                  </Stack>
                  <Stack spacing={1.5} overflow="hidden">
                    {url ? (
                      <ExternalLink href={url}>
                        <Typography variant="subtitle1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" color="primary">
                          {url}
                        </Typography>
                      </ExternalLink>
                    ) : null}
                    {source && resourceId ? (
                      <ExternalLink
                        href={`${env.docsUrl}/resources/${source}${source == 'base' ? '' : `/${service || 'root'}`}/${resourceId}`}
                      >
                        <Tooltip title={resourceId}>
                          <Typography variant="subtitle1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" color="primary">
                            {resourceId}
                          </Typography>
                        </Tooltip>
                      </ExternalLink>
                    ) : null}
                    <Stack gap={0.5}>
                      {allBases.map((base) => (
                        <InternalLink to={`/inventory/search?q=is(${base.fqn})`} key={base.fqn}>
                          <Typography variant="subtitle1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" color="primary">
                            {base.fqn}
                          </Typography>
                        </InternalLink>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Slide>
    </Modal>
  )
}
