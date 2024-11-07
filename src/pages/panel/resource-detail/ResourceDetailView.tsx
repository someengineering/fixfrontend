import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  Accordion,
  AccordionDetails,
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal as MuiModal,
  Skeleton,
  Slide,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { ReactNode, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { CloseIcon, OpenInNewIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryNodeQuery } from 'src/pages/panel/shared/queries'
import { sendInventoryError } from 'src/pages/panel/shared/utils'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { NetworkDiagram } from 'src/shared/charts'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { panelUI } from 'src/shared/constants'
import { ExternalLinkButton } from 'src/shared/link-button'
import { Modal as PopupModal } from 'src/shared/modal'
import { StickyAccordionSummaryWithIcon } from 'src/shared/sticky-accordion-summary'
import { AccountCloud, FailedCheck } from 'src/shared/types/server-shared'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'
import { getLocationSearchValues, removeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { YamlHighlighter } from 'src/shared/yaml-highlighter'
import { stringify } from 'yaml'
import { ResourceDetailChangeLog } from './ResourceDetailChangeLog'
import { ResourceDetailFailedChecks } from './ResourceDetailFailedChecks'

const Modal = styled(MuiModal)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  left: 'auto',
  height: '100%',
  width: '100%',

  [theme.breakpoints.up('md')]: {
    top: panelUI.headerHeight,
    width: '50%',
    height: `calc(100vh - ${panelUI.headerHeight}px)`,
  },

  [theme.breakpoints.up('xl')]: {
    width: '33%',
    maxWidth: 700,
  },
}))

interface GridItemProps {
  property: ReactNode
  value: unknown
  color?: string
  isReactNode?: boolean
}

const GridItem = ({ property, value, color, isReactNode }: GridItemProps) => {
  const isSimpleValue = isReactNode ? true : ['string', 'boolean', 'number'].includes(typeof value)
  const stringValue = isReactNode ? '' : isSimpleValue ? (value as string | boolean | number).toString() : JSON.stringify(value)
  return (
    <>
      <Grid overflow="hidden" width="100%" alignItems="center" height="100%" display="flex">
        <Tooltip arrow title={property} placement="left" slotProps={{ tooltip: { sx: { maxWidth: 'none' } } }}>
          <Typography overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" color="primary.main">
            {property}
          </Typography>
        </Tooltip>
      </Grid>
      <Grid overflow="hidden" width="100%">
        {isReactNode ? (
          (value as ReactNode)
        ) : (
          <Tooltip
            slotProps={{ tooltip: { sx: { maxWidth: '100vw', maxHeight: '100vh', overflow: 'auto', p: 1 } } }}
            title={
              isSimpleValue ? (
                <Typography color={color}>{stringValue}</Typography>
              ) : (
                <pre>
                  <code>
                    <YamlHighlighter>{stringify(value, null, '  ')}</YamlHighlighter>
                  </code>
                </pre>
              )
            }
            placement="left"
          >
            <Typography
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace={'nowrap'}
              component={isSimpleValue ? 'p' : 'pre'}
              color={color}
            >
              {stringValue}
            </Typography>
          </Tooltip>
        )}
      </Grid>
    </>
  )
}

const getOpenResourceButtonText = (cloud: AccountCloud) => {
  switch (cloud) {
    case 'aws':
      return t`in AWS Console`
    case 'azure':
      return t`in Azure Portal`
    case 'gcp':
      return t`in Google Cloud Console`
    default:
      return ''
  }
}

export default function ResourceDetailView() {
  const postHog = usePostHog()
  const { resourceDetailId } = useParams<'resourceDetailId'>()
  const navigate = useAbsoluteNavigate()
  const openResourceModalRef = useRef<(show?: boolean | undefined) => void>()
  const { currentUser, selectedWorkspace } = useUserProfile()
  const {
    i18n: { locale },
  } = useLingui()
  const { data, isLoading, error } = useQuery({
    queryKey: ['workspace-inventory-node', selectedWorkspace?.id, resourceDetailId],
    queryFn: getWorkspaceInventoryNodeQuery,
    throwOnError: false,
    enabled: !!resourceDetailId,
  })

  const nodeNotFound = (error as AxiosError)?.response?.status === 404

  useEffect(() => {
    if (error) {
      sendInventoryError({
        currentUser,
        workspaceId: selectedWorkspace?.id,
        queryFn: 'getWorkspaceInventoryNodeQuery',
        isAdvancedSearch: false,
        error: error as AxiosError,
        id: resourceDetailId,
        postHog,
      })
    }
  }, [resourceDetailId, error, postHog, selectedWorkspace?.id, currentUser])

  const handleClose = () => {
    const search = getLocationSearchValues(window.location.search)
    const pathname = window.location.pathname.split('/').slice(0, -2).join('/')
    navigate({ pathname, search: removeLocationSearchValues(search, ['name', 'cloud']), hash: window.location.hash })
  }

  const {
    id,
    name = window.decodeURIComponent(getLocationSearchValues(window.location.search)?.name || ''),
    kind,
    ctime,
    age: _age,
    tags,
  } = data?.resource.reported ?? {}
  const cloud =
    data?.resource.ancestors?.cloud?.reported?.name ??
    (window.decodeURIComponent(getLocationSearchValues(window.location.search)?.cloud || '') || '-')
  const cloudName = getAccountCloudName(cloud)
  const buttonName = getOpenResourceButtonText(cloud)
  const accountObj = data?.resource.ancestors?.account?.reported
  const account = accountObj ? `${accountObj?.name} (${accountObj?.id})` : '-'
  const region = data?.resource.ancestors?.region?.reported?.name ?? '-'
  const provider_link = data?.resource.metadata.provider_link
  const { tags: _tags, ...reported } = data?.resource.reported ?? {}

  return resourceDetailId ? (
    <Modal open={!!resourceDetailId} onClose={handleClose}>
      <Slide in={!!resourceDetailId} direction="left" mountOnEnter unmountOnExit>
        <Stack
          position="absolute"
          top={0}
          right={0}
          width="100%"
          height="100%"
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 24,
          }}
          direction="column"
          p={1}
          overflow="auto"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            position="sticky"
            top={-8}
            zIndex="modal"
            bgcolor="background.paper"
            p={1}
            boxShadow={1}
          >
            <Stack direction="row" alignItems="center" gap={1} flex={1}>
              {cloud !== '-' ? <CloudAvatar cloud={cloud} /> : null}
              {name}
            </Stack>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          {nodeNotFound ? null : (
            <Accordion defaultExpanded>
              <StickyAccordionSummaryWithIcon offset={6} sx={{ zIndex: ({ zIndex }) => zIndex.fab + 1 }}>
                <Trans>Neighborhood View</Trans>
              </StickyAccordionSummaryWithIcon>
              <Divider />
              <AccordionDetails>
                <Box minHeight={400} width="100%" sx={{ userSelect: 'none' }} display="grid">
                  {data ? <NetworkDiagram mainId={data.resource.id} /> : <Skeleton height="100%" width="100%" variant="rectangular" />}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
          <Accordion defaultExpanded>
            <StickyAccordionSummaryWithIcon offset={6}>
              <Trans>Basic Information</Trans>
            </StickyAccordionSummaryWithIcon>
            <Divider />
            <AccordionDetails>
              {data ? (
                <>
                  <Grid gap={2} gridTemplateColumns="150px 1fr" width="100%" display="grid" mt={1}>
                    <GridItem property={<Trans>Kind</Trans>} value={kind} />
                    <GridItem property={<Trans>ID</Trans>} value={id} />
                    <GridItem property={<Trans>Name</Trans>} value={name} />
                    <GridItem
                      property={<Trans>Cloud</Trans>}
                      value={cloud !== '-' ? <Typography>{cloudName}</Typography> : '-'}
                      isReactNode={cloud !== '-'}
                    />
                    <GridItem property={<Trans>Account</Trans>} value={account} />
                    <GridItem property={<Trans>Region</Trans>} value={region} />
                    <GridItem
                      property={<Trans>Created Time</Trans>}
                      value={`${new Date(ctime as string).toLocaleDateString(locale)} ${new Date(ctime as string).toLocaleTimeString(
                        locale,
                      )}`}
                    />
                    <GridItem
                      property={<Trans>Age</Trans>}
                      value={iso8601DurationToString(diffDateTimeToDuration(new Date(ctime as string), new Date()), 2)}
                    />
                  </Grid>
                  <Stack direction="row" justifyContent="end" mt={2}>
                    {provider_link ? (
                      cloud === 'aws' ? (
                        <>
                          <PopupModal
                            openRef={openResourceModalRef}
                            title={<Trans>See this resource {buttonName}</Trans>}
                            width={panelUI.minLargeModalWidth}
                            actions={
                              <Button
                                variant="outlined"
                                href={provider_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => openResourceModalRef.current?.(false)}
                                endIcon={<OpenInNewIcon />}
                              >
                                <Trans>See this resource {buttonName}</Trans>
                              </Button>
                            }
                          >
                            <Alert severity="warning">
                              <AlertTitle>
                                <Trans>
                                  To access this resource, please ensure that you are logged into the {cloudName} account: {account}
                                </Trans>
                              </AlertTitle>
                            </Alert>
                          </PopupModal>
                          <Button variant="contained" onClick={() => openResourceModalRef.current?.(true)} endIcon={<OpenInNewIcon />}>
                            <Trans>See this resource {buttonName}</Trans>
                          </Button>
                        </>
                      ) : (
                        <ExternalLinkButton href={provider_link} variant="contained">
                          <Trans>See this resource {buttonName}</Trans>
                        </ExternalLinkButton>
                      )
                    ) : null}
                  </Stack>
                </>
              ) : isLoading ? (
                <>
                  <Skeleton height={200} width="100%" variant="rounded" />
                </>
              ) : error ? (
                <Stack height={200} width="100%" alignItems="center" justifyContent="center">
                  <Typography color="info.main" component="span" variant="h6">
                    {nodeNotFound ? (
                      <Trans>The selected resource does not exist anymore.</Trans>
                    ) : (
                      <Trans>Something went wrong please try again later.</Trans>
                    )}
                  </Typography>
                </Stack>
              ) : null}
            </AccordionDetails>
          </Accordion>
          {data && Object.entries(tags ?? {}).length ? (
            <Accordion>
              <StickyAccordionSummaryWithIcon offset={6}>
                <Trans>Tags</Trans>
              </StickyAccordionSummaryWithIcon>
              <Divider />
              <AccordionDetails>
                <Grid gap={2} gridTemplateColumns="50% 1fr" width="100%" display="grid" mt={1}>
                  {Object.entries(tags as Record<string, string>).map(([property, value], key) => (
                    <GridItem key={key} property={property} value={value} />
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ) : null}
          {error ? null : (
            <Accordion>
              <StickyAccordionSummaryWithIcon offset={6}>
                <Trans>Details</Trans>
              </StickyAccordionSummaryWithIcon>
              <Divider />
              <AccordionDetails>
                {data?.resource.reported ? (
                  <Stack overflow="auto">
                    <pre>
                      <code>
                        <YamlHighlighter>{stringify(reported, null, '  ')}</YamlHighlighter>
                      </code>
                    </pre>
                  </Stack>
                ) : isLoading ? (
                  <>
                    <Skeleton height={400} width="100%" variant="rounded" />
                  </>
                ) : null}
              </AccordionDetails>
            </Accordion>
          )}
          {data?.resource.security?.has_issues || data?.resource.metadata.security_ignore ? (
            <ResourceDetailFailedChecks
              securityIgnore={data?.resource.metadata.security_ignore}
              securityIgnoreTitles={
                data?.resource.metadata.security_ignore !== '*'
                  ? data?.resource.metadata.security_ignore?.map(
                      (ignored) => data.checks.find((check) => check.id === ignored)?.title ?? '',
                    )
                  : undefined
              }
              resourceDetailId={resourceDetailId}
              failingChecks={
                data.resource.security?.issues
                  .map((issue) => data.checks.find((check) => check.id === issue.check))
                  .filter((i) => i) as FailedCheck[]
              }
              nodeSecurityIssues={data.resource.security?.issues ?? []}
            />
          ) : null}
          {resourceDetailId && (!error || nodeNotFound) ? (
            <ResourceDetailChangeLog notFound={nodeNotFound} defaultResource={data?.resource} />
          ) : null}
        </Stack>
      </Slide>
    </Modal>
  ) : undefined
}
