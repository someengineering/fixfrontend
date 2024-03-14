import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal as MuiModal,
  Paper,
  Skeleton,
  Slide,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { FailedChecks } from 'src/pages/panel/shared/failed-checks'
import { getWorkspaceInventoryNodeQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { NetworkDiagram } from 'src/shared/charts'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { panelUI } from 'src/shared/constants'
import { Modal as PopupModal } from 'src/shared/modal'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'
import { getLocationSearchValues, removeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { YamlHighlighter } from 'src/shared/yaml-highlighter'
import { stringify } from 'yaml'
import { ResourceDetailChangeLog } from './ResourceDetailChangeLog'
import { inventorySendToGTM } from './utils'

export const ResourceDetailAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(6),
  background: 'inherit',
  boxShadow: theme.shadows[2],
  zIndex: 1,
}))

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

const GridItem = ({
  property,
  value,
  color,
  isReactNode,
}: {
  property: ReactNode
  value: unknown
  color?: string
  isReactNode?: boolean
}) => {
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

export const ResourceDetail = () => {
  const { resourceDetailId } = useParams()
  const navigate = useAbsoluteNavigate()
  const openResourceModalRef = useRef<(show?: boolean | undefined) => void>()
  const { selectedWorkspace } = useUserProfile()
  const {
    i18n: { locale },
  } = useLingui()
  const { data, isLoading, error } = useQuery({
    queryKey: ['workspace-inventory-node', selectedWorkspace?.id, resourceDetailId],
    queryFn: getWorkspaceInventoryNodeQuery,
    throwOnError: false,
    enabled: !!resourceDetailId,
  })
  const [selectedRow, setSelectedRow] = useState(resourceDetailId)

  useEffect(() => {
    if (error) {
      inventorySendToGTM('getWorkspaceInventoryNodeQuery', false, error as AxiosError, resourceDetailId, resourceDetailId)
    }
  }, [resourceDetailId, error])

  useEffect(() => {
    if (resourceDetailId) {
      setSelectedRow(resourceDetailId)
    }
  }, [resourceDetailId])

  const handleClose = () => {
    const search = getLocationSearchValues(window.location.search)
    navigate({ pathname: '/inventory', search: removeLocationSearchValues(search, 'name') })
  }

  const {
    id,
    name = getLocationSearchValues(window.location.search)?.name || '',
    kind,
    ctime,
    age: _age,
    tags,
  } = data?.resource.reported ?? {}
  const cloud = data?.resource.ancestors?.cloud?.reported?.name ?? '-'
  const accountObj = data?.resource.ancestors?.account?.reported
  const account = accountObj ? `${accountObj?.name} (${accountObj?.id})` : '-'
  const region = data?.resource.ancestors?.region?.reported?.name ?? '-'
  const provider_link = data?.resource.metadata.provider_link
  const { tags: _tags, ...reported } = data?.resource.reported ?? {}

  return selectedRow ? (
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
          <Box minHeight={400} width="100%" sx={{ userSelect: 'none' }}>
            {data ? <NetworkDiagram mainId={data.resource.id} /> : null}
          </Box>
          <Accordion defaultExpanded>
            <ResourceDetailAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Trans>Basic Information</Trans>
            </ResourceDetailAccordionSummary>
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
                      value={cloud !== '-' ? <Typography>{cloud.toUpperCase()}</Typography> : '-'}
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
                      <>
                        <PopupModal
                          openRef={openResourceModalRef}
                          title={<Trans>Open resource {name} in AWS Console</Trans>}
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
                              <Trans>See this Resource in AWS Console</Trans>
                            </Button>
                          }
                        >
                          <Alert color="warning">
                            <Typography>
                              <Trans>To access this resource, please ensure that you are logged into the AWS account: {account}</Trans>
                            </Typography>
                          </Alert>
                        </PopupModal>
                        <Button variant="contained" onClick={() => openResourceModalRef.current?.(true)} endIcon={<OpenInNewIcon />}>
                          <Trans>See this Resource in AWS Console</Trans>
                        </Button>
                      </>
                    ) : null}
                  </Stack>
                </>
              ) : isLoading ? (
                <>
                  <Skeleton height={200} width="100%" variant="rounded" />
                </>
              ) : null}
            </AccordionDetails>
          </Accordion>
          {data && Object.entries(tags ?? {}).length ? (
            <Accordion>
              <ResourceDetailAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Trans>Tags</Trans>
              </ResourceDetailAccordionSummary>
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
          <Accordion>
            <ResourceDetailAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Trans>Details</Trans>
            </ResourceDetailAccordionSummary>
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
          {data?.resource.security?.has_issues ? (
            <Accordion defaultExpanded>
              <ResourceDetailAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Trans>Security Issues</Trans>
              </ResourceDetailAccordionSummary>
              <Divider />
              <AccordionDetails>
                {data.failing_checks.map((failedCheck, i) => (
                  <Fragment key={i}>
                    <Paper elevation={1}>
                      <FailedChecks failedCheck={failedCheck} smallText />
                    </Paper>
                    <Divider />
                  </Fragment>
                ))}

                {/* <Grid gap={2} gridTemplateColumns="150px 1fr" display="grid">
                  <GridItem
                    property={<Trans>Found at</Trans>}
                    value={`${new Date(data.resource.security.opened_at).toLocaleDateString(locale)} ${new Date(
                      data.resource.security.opened_at,
                    ).toLocaleTimeString(locale)}`}
                  />
                  <GridItem
                    property={<Trans>Severity</Trans>}
                    value={snakeCaseWordsToUFStr(data.resource.security.severity)}
                    color={getColorBySeverity(data.resource.security.severity)}
                  />
                  <GridItem property={<Trans>Issues</Trans>} value={null} isReactNode />

                  {data.resource.security.issues.map((issue, i) => (
                    <Fragment key={i}>
                      <Divider />
                      <Divider />
                      <GridItem property={<Trans>Check</Trans>} value={issue.check} />
                      <GridItem
                        property={<Trans>Found at</Trans>}
                        value={`${new Date(issue.opened_at).toLocaleDateString(locale)} ${new Date(issue.opened_at).toLocaleTimeString(locale)}`}
                      />
                      <GridItem
                        property={<Trans>Severity</Trans>}
                        color={getColorBySeverity(issue.severity)}
                        value={snakeCaseWordsToUFStr(issue.severity)}
                      />
                    </Fragment>
                  ))}
                </Grid> */}
              </AccordionDetails>
            </Accordion>
          ) : null}
          {resourceDetailId ? <ResourceDetailChangeLog /> : null}
        </Stack>
      </Slide>
    </Modal>
  ) : undefined
}
