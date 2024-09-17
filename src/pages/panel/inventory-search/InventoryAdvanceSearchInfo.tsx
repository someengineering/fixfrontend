import { Trans } from '@lingui/macro'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { Button, IconButton, Link, Popover, Stack, Typography } from '@mui/material'
import { Fragment, useId, useState } from 'react'
import { OpenInNewIcon } from 'src/assets/icons'
import { useNonce } from 'src/shared/providers'
import { useCopyString } from 'src/shared/utils/useCopyString'

const operators = ['<', '>', '=', '~', '!=', '~=', '<=', '>=']
const booleanOperators = ['and', 'or', 'not']
const searchInstance = '"10.0.245.1"'
const searchEc2InstanceCores = 'is(aws_ec2_instance) and instance_cores > 4'
const searchTagsOwners = 'tags.owner = sre'
const owner = 'owner'
const sre = 'sre'
const attributeOperatorValue = 'attribute operator value'

export const InventoryAdvanceSearchInfo = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const nonce = useNonce()
  const handleCopy = useCopyString()
  const id = useId()
  return (
    <>
      <IconButton size="small" color="info" onClick={(e) => setAnchorEl(e.currentTarget)} aria-describedby={id}>
        <InfoRoundedIcon />
      </IconButton>
      <Popover
        id={id}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography
          component={Stack}
          width={850}
          maxWidth={({ spacing }) => `calc(100% - ${spacing(4)})`}
          spacing={2}
          m={2}
          sx={{
            button: {
              fontFamily: 'inherit',
            },
            pre: {
              display: 'inline',
              m: 0,
              whiteSpace: 'pre-wrap',
              color: 'primary.main',
            },
          }}
        >
          <Trans>
            <span>
              Fix supports full text search by encasing the search term in double quotes. For instance,
              <Button size="small" onClick={() => handleCopy(searchInstance)}>
                <pre>
                  <code>{searchInstance}</code>
                </pre>
              </Button>
              enables you to scan your entire infrastructure for a specific IP address.
            </span>
            <span>
              Additionally, you can query for any resource attribute by utilizing the{' '}
              <pre>
                <code>{attributeOperatorValue}</code>
              </pre>{' '}
              format, where the operator can be{' '}
              {operators.slice(0, -1).map((operator) => (
                <Fragment key={operator}>
                  <pre>
                    <code>{operator}</code>
                  </pre>
                  ,{' '}
                </Fragment>
              ))}
              or{' '}
              <pre>
                <code>{operators.slice(-1)[0]}</code>
              </pre>
              . For example,
              <Button size="small" onClick={() => handleCopy(searchTagsOwners)}>
                <pre>
                  <code>{searchTagsOwners}</code>
                </pre>
              </Button>
              allows you to find all resources tagged with an{' '}
              <pre>
                <code>{owner}</code>
              </pre>{' '}
              attribute equal to{' '}
              <pre>
                <code>{sre}</code>
              </pre>
              .
            </span>
            <span>
              Search queries can be refined using boolean operators{' '}
              {booleanOperators.slice(0, -1).map((booleanOperator) => (
                <Fragment key={booleanOperator}>
                  <pre>
                    <code>{booleanOperator}</code>
                  </pre>
                  ,{' '}
                </Fragment>
              ))}
              <pre>
                <code>{booleanOperators.slice(-1)[0]}</code>
              </pre>{' '}
              to combine multiple terms. An example would be
              <Button size="small" onClick={() => handleCopy(searchEc2InstanceCores)}>
                <pre>
                  <code>{searchEc2InstanceCores}</code>
                </pre>
              </Button>
              to identify all EC2 instances possessing more than 4 cores.
            </span>
            <span>
              For detailed search syntax guidance, visit{' '}
              <Link
                target="_blank"
                href="https://docs.fix.security/search-syntax"
                alignContent="center"
                alignItems="center"
                display="inline-flex"
                whiteSpace="nowrap"
              >
                https://docs.fix.security/search-syntax
                <OpenInNewIcon fontSize="small" style={{ marginLeft: 4 }} nonce={nonce} />
              </Link>
            </span>
          </Trans>
        </Typography>
      </Popover>
    </>
  )
}
