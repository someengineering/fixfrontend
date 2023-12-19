import { Trans } from '@lingui/macro'
import CloseIcon from '@mui/icons-material/Close'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { FailedChecks } from 'src/pages/panel/shared/failed-checks'
import { postWorkspaceInventoryNodeQuery } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
import { PostWorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'
import { YamlHighlighter } from 'src/shared/yaml-highlighter'
import { stringify } from 'yaml'
import { inventorySendToGTM } from './utils'

interface ResourceDetailProps {
  detail: PostWorkspaceInventorySearchTableRow | undefined
  onClose: () => void
}

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
      <Grid overflow="hidden" width="100%">
        <Tooltip arrow title={property} placement="left" slotProps={{ tooltip: { sx: { maxWidth: 'none' } } }}>
          <Typography overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
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
                  <YamlHighlighter>{stringify(value, null, '  ')}</YamlHighlighter>
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

export const ResourceDetail = ({ detail, onClose }: ResourceDetailProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { data, isLoading, error } = useQuery({
    queryKey: ['workspace-inventory-node', selectedWorkspace?.id, detail?.id],
    queryFn: postWorkspaceInventoryNodeQuery,
    throwOnError: false,
  })
  const [selectedRow, setSelectedRow] = useState(detail)

  useEffect(() => {
    if (error) {
      inventorySendToGTM('postWorkspaceInventoryNodeQuery', false, error as AxiosError, detail?.id, detail?.id)
    }
  }, [detail?.id, error])

  useEffect(() => {
    if (detail) {
      setSelectedRow(detail)
    }
  }, [detail])

  const { id, name, kind, ctime, age: _age, tags } = data?.resource.reported ?? {}
  const { tags: _tags, ...reported } = data?.resource.reported ?? {}

  return selectedRow ? (
    <Modal open={!!detail} onClose={onClose}>
      <Slide in={!!detail} direction="left" mountOnEnter unmountOnExit>
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
          spacing={1}
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
            <Box flex={1}>{selectedRow.row['name']}</Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          {/* <Box minHeight={400} width="100%" sx={{ userSelect: 'none' }}>
            {data ? (
              <NetworkDiagram data={data.neighborhood} />
            ) : isLoading ? (
              <Skeleton height={400} width="100%" variant="rectangular" />
            ) : null}
          </Box> */}
          <Accordion defaultExpanded>
            <AccordionSummary>
              <Trans>Basic Information</Trans>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              {data ? (
                <Grid gap={2} gridTemplateColumns="150px 1fr" width="100%" display="grid" mt={1}>
                  <GridItem property={<Trans>Kind</Trans>} value={kind} />
                  <GridItem property={<Trans>ID</Trans>} value={id} />
                  <GridItem property={<Trans>Name</Trans>} value={name} />
                  <GridItem
                    property={<Trans>Created Time</Trans>}
                    value={`${new Date(ctime as string).toLocaleDateString()} ${new Date(ctime as string).toLocaleTimeString()}`}
                  />
                  <GridItem
                    property={<Trans>Age</Trans>}
                    value={iso8601DurationToString(diffDateTimeToDuration(new Date(ctime as string), new Date()), 2)}
                  />
                </Grid>
              ) : isLoading ? (
                <>
                  <Skeleton height={200} width="100%" variant="rectangular" />
                </>
              ) : null}
            </AccordionDetails>
          </Accordion>
          {data && Object.entries(tags ?? {}).length ? (
            <Accordion>
              <AccordionSummary>
                <Trans>Tags</Trans>
              </AccordionSummary>
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
            <AccordionSummary>
              <Trans>Details</Trans>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              {data?.resource.reported ? (
                <Stack overflow="auto">
                  <pre>
                    <YamlHighlighter>{stringify(reported, null, '  ')}</YamlHighlighter>
                  </pre>
                </Stack>
              ) : isLoading ? (
                <>
                  <Skeleton height={400} width="100%" variant="rectangular" />
                </>
              ) : null}
            </AccordionDetails>
          </Accordion>
          {data?.resource.security?.has_issues ? (
            <Accordion defaultExpanded>
              <AccordionSummary>
                <Trans>Security Issues</Trans>
              </AccordionSummary>
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
                    value={`${new Date(data.resource.security.opened_at).toLocaleDateString()} ${new Date(
                      data.resource.security.opened_at,
                    ).toLocaleTimeString()}`}
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
                        value={`${new Date(issue.opened_at).toLocaleDateString()} ${new Date(issue.opened_at).toLocaleTimeString()}`}
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
        </Stack>
      </Slide>
    </Modal>
  ) : undefined
}
